import express from 'express';
import { sendContactFormEmail, sendEmail, sendRSVPEmail } from './emails.js';
import { RSVP_COMMENTS_MAXCHARS, RSVP_DIETARY_MAXCHARS, RSVP_FULLNAME_MAXCHARS, RSVP_LOCATION_MAXCHARS, UNKNOWN_GUEST_NAME, } from '../../client/src/constants.js';
import { readFileSync, writeFile } from 'fs';
import { crypto_box_seal, randombytes_buf } from '@devtomio/sodium';
import emailInfo from './assets/confidential.json' with { type: 'json' };
import winston from 'winston';
const RSVP_FILE_PATH = './build/server/src/assets/rsvp.json';
const logger = winston.createLogger({
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'warn' }),
        new winston.transports.File({ filename: 'verbose.log', level: 'verbose' }),
        new winston.transports.File({ filename: 'info.log', level: 'info' }),
        // new winston.transports.Console({ 
        // 	format: winston.format.simple(),
        // 	level: 'info',
        // }),
    ],
});
logger.info('Starting server');
const rsvpData = JSON.parse(readFileSync(RSVP_FILE_PATH).toString('utf8'));
logger.info('Read JSON data');
const pk = readFileSync('./build/server/src/assets/pk');
logger.info('Read public key');
const nonces = [];
function checkNonce(nonce) {
    const NONCE_TIMEOUT = 30000; //ms
    outer: for (let i = 0; i < nonces.length; i++) {
        if (new Date().getTime() >= nonces[i].time + NONCE_TIMEOUT) {
            nonces.splice(i, 1);
            i--;
            continue;
        }
        if (nonces[i].nonce.length !== nonce.length) {
            continue;
        }
        for (let j = 0; j < nonce.length; j++) {
            if (nonce[j] !== nonces[i].nonce[j]) {
                continue outer;
            }
        }
        nonces.splice(i, 1); //nonces are single use!
        return true;
    }
    return false;
}
export default function main() {
    writeJson();
    const port = 8080;
    const app = express();
    app.listen(port, () => {
        logger.info(`matthewandadelewedding.co.uk server listening on port ${port}`);
    });
    app.use(express.json());
    sendemailSetupHandler(app);
    checkrsvpSetupHandler(app);
    getrsvpSetupHandler(app);
    authSetupHandler(app);
    updatersvpSetupHandler(app);
    unsubscribeSetupHandler(app);
    pkSetupHandler(app);
    deleteinviteSetupHandler(app);
    app.use(express.static('static'));
    app.get('*', function (_, res) {
        res.sendFile('static/index.html', { root: process.cwd() });
    });
}
function writeJson() {
    logger.silly('writing json');
    writeFile(RSVP_FILE_PATH, JSON.stringify(rsvpData), { encoding: 'utf-8', flag: 'w', flush: true }, afterWriteJson);
}
let lastErrorEmailSentAt = 0;
function afterWriteJson(err) {
    logger.silly('wrote json');
    setTimeout(writeJson, 5000);
    if (err) {
        logger.error(err);
        if (new Date().getTime() >= lastErrorEmailSentAt + 60 * 1000 * 10) {
            const message = `Notification from server: error when writing json file. ${JSON.stringify(err, Object.getOwnPropertyNames(err))}`;
            sendEmail(message, message, 'Wedding website error notification!', 'Wedding Webserver', emailInfo.contactFormToEmail);
            lastErrorEmailSentAt = new Date().getTime();
        }
    }
}
function pkSetupHandler(app) {
    app.get('/api/pk', (_, res) => {
        try {
            logger.info('Received request for public key');
            res.status(200).json({ pk: Buffer.from(pk).toString('base64') });
        }
        catch (e) {
            logger.error(e);
            res.status(500).json({
                errorMessage: JSON.stringify(e, Object.getOwnPropertyNames(e)),
            });
        }
    });
}
function unsubscribeSetupHandler(app) {
    app.get('/api/unsubscribe', (req, res) => {
        try {
            const inviteId = req.query.id;
            if (typeof inviteId !== 'string' || rsvpData[inviteId] === undefined) {
                logger.warn(`Someone tried to unsubscribe with invalid invite id ${inviteId}`);
                res.status(400).send('Error 400 - Bad Request: invalid invite id');
                return;
            }
            if (rsvpData[inviteId].doNotEmail) {
                logger.info(`Invite ${inviteId} unsubscribed from emails, but was already unsubscribed`);
                res.status(200).send('You are already unsubscribed.');
                return;
            }
            rsvpData[inviteId].doNotEmail = true;
            logger.info(`Invite ${inviteId} unsubscribed from emails`);
            res.status(200).send('You have now been unsubscribed.');
        }
        catch (e) {
            logger.error(e);
            res.status(500).json({
                errorMessage: JSON.stringify(e, Object.getOwnPropertyNames(e)),
            });
        }
    });
}
function deleteinviteSetupHandler(app) {
    app.post('/api/deleteinvite', (req, res) => {
        try {
            const body = req.body;
            if (!body.nonce) {
                logger.info(`deleteinvite request received with no nonce for invite ${body.inviteId}`);
                res.status(400).json({ errorMessage: 'invalid body, no nonce' });
                return;
            }
            const nonce = Uint8Array.from(Buffer.from(body.nonce, 'base64'));
            if (checkNonce(nonce)) {
                if (body.inviteId in rsvpData) {
                    logger.info(`deleteinvite request received for invite ${body.inviteId}`);
                    delete rsvpData[body.inviteId];
                    res.status(200).json({});
                }
                else {
                    logger.info(`deleteinvite request received for invalid invite id ${body.inviteId}`);
                    res.status(400).json({ errorMessage: 'invalid invite id' });
                }
            }
            else {
                logger.warn(`deleteinvite request received with invalid nonce for invite ${body.inviteId}`);
                res.status(401).json({ errorMessage: 'invalid nonce' });
            }
        }
        catch (e) {
            logger.error(e);
            res.status(500).json({
                errorMessage: JSON.stringify(e, Object.getOwnPropertyNames(e)),
            });
        }
    });
}
function updatersvpSetupHandler(app) {
    app.post('/api/updatersvp', (req, res) => {
        try {
            const body = req.body;
            body.submitterName = body.submitterName?.slice(0, RSVP_FULLNAME_MAXCHARS);
            body.people = body.people?.map((e) => {
                e.comments = e.comments?.slice(0, RSVP_COMMENTS_MAXCHARS);
                e.dietary = e.dietary?.slice(0, RSVP_DIETARY_MAXCHARS);
                e.name = { displayName: e.name.displayName.slice(0, RSVP_FULLNAME_MAXCHARS), altNames: e.name.altNames.map(e => e.slice(0, RSVP_FULLNAME_MAXCHARS)) };
                return e;
            });
            body.locationLift = body.locationLift?.slice(0, RSVP_LOCATION_MAXCHARS);
            if (body.adminAuth) {
                const nonce = Uint8Array.from(Buffer.from(body.adminAuth, 'base64'));
                if (!checkNonce(nonce)) {
                    logger.warn(`updatersvp - incorrect admin credentials provided. inviteid ${body.inviteId}`);
                    res.status(401).json({ errorMessage: 'invalid nonce' });
                    return;
                }
                logger.info(`updatersvp received from admin for inviteid ${body.inviteId}`);
                rsvpData[body.inviteId] = {
                    invitedToAfternoon: body.invitedToAfternoon ??
                        rsvpData[body.inviteId]?.invitedToAfternoon ??
                        false,
                    data: rsvpData[body.inviteId]?.data ?? '',
                    doNotEmail: body.emailUpdates === undefined ? rsvpData[body.inviteId]?.doNotEmail ?? true : !body.emailUpdates,
                    submittedBy: body.submitterName ?? rsvpData[body.inviteId]?.submittedBy,
                    peopleOnInvite: body.people?.map((e) => e.name) ??
                        rsvpData[body.inviteId]?.peopleOnInvite ??
                        [],
                    plusOnes: body.plusOnes ?? rsvpData[body.inviteId]?.plusOnes,
                };
                if (body.people) {
                    const toEncrypt = {
                        email: body.email,
                        time: new Date().toISOString(),
                        people: body.people,
                        ceremonyLift: body.ceremonyLift,
                        liftSpaces: body.liftSpaces,
                        locationLift: body.locationLift,
                        liftEmailConsent: body.liftEmailConsent,
                        needOrCanGiveLift: body.needOrCanGiveLift
                    };
                    const encryptedBinary = crypto_box_seal(new TextEncoder().encode(JSON.stringify(toEncrypt)), pk);
                    rsvpData[body.inviteId].data =
                        Buffer.from(encryptedBinary).toString('base64');
                }
                sendRSVPEmail(body);
                res.status(200).json({});
            }
            else {
                logger.warn(body);
                if (rsvpData[body.inviteId] === undefined) {
                    logger.warn(`updatersvp received from normal user ${body.submitterName} with invalid invite ID: ${body.inviteId}`);
                    res.status(400).json({ errorMessage: 'invalid invite ID' });
                    return;
                }
                else if (rsvpData[body.inviteId].submittedBy) {
                    logger.verbose(`updatersvp received from normal user ${body.submitterName}, rsvp already submitted: ${body.inviteId}`);
                    res.status(401).json({
                        errorMessage: `your rsvp has already been submitted by ${rsvpData[body.inviteId].submittedBy}`,
                    });
                    return;
                }
                const names = body.people?.map((e) => e.name);
                if (!names ||
                    !rsvpData[body.inviteId].peopleOnInvite.every((e) => names.map(e => e.displayName).includes(e.displayName))) {
                    logger.warn(`updatersvp received from normal user ${body.submitterName}, name missing from rsvp ${body.inviteId}. Names on invite: ${rsvpData[body.inviteId].peopleOnInvite}. Names given: ${names?.map(e => e.displayName)}`);
                    res.status(401).json({
                        errorMessage: `some data was missing from your rsvp response!`,
                    });
                    return;
                }
                rsvpData[body.inviteId].peopleOnInvite.forEach((e) => names.splice(names.map(e => e.displayName).indexOf(e.displayName), 1));
                if (names.length !== (rsvpData[body.inviteId].plusOnes ?? 0)) {
                    logger.warn(`updatersvp received from normal user ${body.submitterName}, incorrect plusones ${body.inviteId}. Names on invite: ${rsvpData[body.inviteId].peopleOnInvite}. Names given: ${names.map(e => e.displayName)}. Plusones: ${rsvpData[body.inviteId].plusOnes}`);
                    res.status(401).json({
                        errorMessage: `invalid plusones given in your rsvp response!`,
                    });
                    return;
                }
                logger.warn(names
                    ?.flatMap((e) => [e.displayName.toLowerCase(), ...e.altNames.map(e => e.toLowerCase())])
                    .concat(Object.entries(rsvpData).flatMap((e) => e[0] === body.inviteId ? [] : e[1].peopleOnInvite.flatMap(e => [e.displayName.toLowerCase(), ...e.altNames.map(e => e.toLowerCase())]))).filter(e => e !== UNKNOWN_GUEST_NAME.toLowerCase()));
                if (!names
                    ?.flatMap((e) => [e.displayName.toLowerCase(), ...e.altNames.map(e => e.toLowerCase())])
                    .concat(Object.entries(rsvpData).flatMap((e) => e[0] === body.inviteId ? [] : e[1].peopleOnInvite.flatMap(e => [e.displayName.toLowerCase(), ...e.altNames.map(e => e.toLowerCase())]))).filter(e => e !== UNKNOWN_GUEST_NAME.toLowerCase())
                    .every((e, i, arr) => {
                    return arr.indexOf(e) === i;
                })) {
                    logger.error(`updatersvp received from normal user ${body.submitterName}, duplicate name given. Names given: ${names.map(e => e.displayName)}. Plusones: ${rsvpData[body.inviteId].plusOnes}`);
                    res.status(401).json({
                        errorMessage: `Sorry, either you provided two people with the same name or someone with a name you provided is already present on another invitation!`,
                    });
                    return;
                }
                logger.verbose(`updatersvp received from normal user ${body.submitterName}: ${body.inviteId}`);
                const toEncrypt = {
                    email: body.email,
                    liftEmailConsent: body.liftEmailConsent,
                    time: new Date().toISOString(),
                    people: body.people,
                    ceremonyLift: body.ceremonyLift,
                    liftSpaces: body.liftSpaces,
                    locationLift: body.locationLift,
                    needOrCanGiveLift: body.needOrCanGiveLift,
                };
                const encryptedBinary = crypto_box_seal(new TextEncoder().encode(JSON.stringify(toEncrypt)), pk);
                const encryptedString = Buffer.from(encryptedBinary).toString('base64');
                rsvpData[body.inviteId].submittedBy = body.submitterName;
                rsvpData[body.inviteId].data = encryptedString;
                rsvpData[body.inviteId].peopleOnInvite =
                    body.people?.map((e) => e.name) ?? [];
                rsvpData[body.inviteId].plusOnes = undefined;
                rsvpData[body.inviteId].doNotEmail = !body.emailUpdates;
                sendRSVPEmail(body);
                res.status(200).json({});
            }
        }
        catch (e) {
            logger.error(e);
            res.status(500).json({
                errorMessage: JSON.stringify(e, Object.getOwnPropertyNames(e)),
            });
        }
    });
}
function getrsvpSetupHandler(app) {
    app.post('/api/getrsvp', (req, res) => {
        try {
            const body = req.body;
            if (!body.nonce) {
                logger.info('getrsvp request received with no nonce');
                res.status(400).json({ errorMessage: 'invalid body, no nonce' });
                return;
            }
            const nonce = Uint8Array.from(Buffer.from(body.nonce, 'base64'));
            if (checkNonce(nonce)) {
                logger.info('getrsvp request received');
                res.status(200).json(rsvpData);
            }
            else {
                logger.warn('getrsvp request received with invalid nonce');
                res.status(401).json({ errorMessage: 'invalid nonce' });
            }
        }
        catch (e) {
            logger.error(e);
            res.status(500).json({
                errorMessage: JSON.stringify(e, Object.getOwnPropertyNames(e)),
            });
        }
    });
}
function authSetupHandler(app) {
    app.get('/api/auth', (_, res) => {
        try {
            logger.info('auth request received');
            const nonce = randombytes_buf(32);
            const cipherText = crypto_box_seal(nonce, pk);
            nonces.push({ nonce, time: new Date().getTime() });
            res.json({ nonce: Buffer.from(cipherText).toString('base64') });
        }
        catch (e) {
            logger.error(e);
            res.status(500).json({
                errorMessage: JSON.stringify(e, Object.getOwnPropertyNames(e)),
            });
        }
    });
}
function checkrsvpSetupHandler(app) {
    app.get('/api/checkrsvp', (req, res) => {
        try {
            const name = req.query.name;
            const inviteId = Object.entries(rsvpData).find((e) => e[1].peopleOnInvite
                .flatMap((e) => [e.displayName.toLowerCase(), ...e.altNames.map(e => e.toLowerCase())])
                .includes(name?.toLowerCase()))?.[0];
            if (inviteId === undefined) {
                logger.verbose(`checkrsvp request received with invalid name: ${name} `);
                res.status(400).json({
                    errorMessage: 'could not find anyone with that name',
                });
                return;
            }
            logger.verbose(`checkrsvp request received with name: ${name} for inviteid ${inviteId}`);
            res.status(200).json({
                submittedBy: rsvpData[inviteId].submittedBy,
                peopleOnInvite: rsvpData[inviteId].peopleOnInvite,
                invitedToAfternoon: rsvpData[inviteId].invitedToAfternoon,
                plusOnes: rsvpData[inviteId].plusOnes,
                inviteId,
            });
        }
        catch (e) {
            logger.error(e);
            res.status(500).json({
                errorMessage: JSON.stringify(e, Object.getOwnPropertyNames(e)),
            });
        }
    });
}
function sendemailSetupHandler(app) {
    const DUPE_TIMEOUT_SUCCESS = 300000; //ms
    const DUPE_TIMEOUT_FAIL = 5000;
    const contactFormRequests = {};
    app.post('/api/sendemail', async (req, res) => {
        const time = new Date().getTime();
        const body = req.body;
        try {
            if (contactFormRequests[JSON.stringify(body)] &&
                time - contactFormRequests[JSON.stringify(body)] <
                    DUPE_TIMEOUT_SUCCESS) {
                res
                    .status(400)
                    .json({ errorMessage: 'duplicate request, try again later.' });
                logger.info(`email request from ${body.name} rejected due to duplicate request`);
                return;
            }
            logger.verbose(`email request received from ${body.name}`);
            contactFormRequests[JSON.stringify(body)] = time;
            const result = await sendContactFormEmail(body.message, body.subject, body.name, body.email);
            logger.verbose(`email request from ${body.name} sent successfully`);
            res.status(200).json(result);
        }
        catch (e) {
            contactFormRequests[JSON.stringify(body)] =
                time - DUPE_TIMEOUT_SUCCESS + DUPE_TIMEOUT_FAIL;
            logger.error(e);
            res.status(500).json({
                errorMessage: JSON.stringify(e, Object.getOwnPropertyNames(e)),
            });
        }
    });
}
main();
