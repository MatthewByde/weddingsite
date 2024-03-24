import express from 'express';
import { sendContactFormEmail } from './emails.js';
import { readFileSync } from 'fs';
import { crypto_box_seal, randombytes_buf } from '@devtomio/sodium';
const rsvpData = (() => {
    const json = JSON.parse(readFileSync('./build/assets/rsvp.json').toString('utf8'));
    if (json.invites === undefined) {
        json.invites = {};
    }
    if (json.people === undefined) {
        json.people = {};
    }
    return json;
})();
const pk = readFileSync('./build/assets/pk');
const nonces = [];
function checkNonce(nonce) {
    const NONCE_TIMEOUT = 120000;
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
    const port = 8080;
    const app = express();
    app.use(express.static('../static'));
    app.listen(port, () => {
        console.log(`matthewandadelewedding.co.uk server listening on port ${port}`);
    });
    app.use(express.json());
    sendemailSetupHandler(app);
    checkrsvpSetupHandler(app);
    getrsvpSetupHandler(app);
    authSetupHandler(app);
    updatersvpSetupHandler(app);
}
function updatersvpSetupHandler(app) {
    app.post('/api/updatersvp', (req, res) => {
        const body = req.body();
        const name = req.query.name;
        const inviteId = rsvpData.people[name];
        if (body.adminAuth) {
            //TODO
        }
        else {
            if (inviteId === undefined) {
                res.status(400).json({
                    errorMessage: 'could not find a user with that name.',
                });
            }
            else if (rsvpData.invites[inviteId] === undefined) {
                res.status(500).json({ errorMessage: 'data unexpectedly missing.' });
            }
            else if (rsvpData.invites[inviteId].responded) {
                res
                    .status(401)
                    .json({ errorMessage: 'you have already submitted your rsvp!' });
            }
            const cipherText = crypto_box_seal(Buffer.from(body.data), pk);
            rsvpData.invites[inviteId].data =
                Buffer.from(cipherText).toString('base64');
            //TODO create type for the data JSON. Verify that received data matches this prior to encrypting. We can also use this on client side when decrypting.
        }
    });
}
//TODO setInterval to save the JSON to file
//TODO client-side encryption for updateRsvp - use api request to return the public key to client, and have client encrypt data if it can. if it can't, continue as we do currently, and encrypt it severside. If it can, have it do so, and don't encrypt it serverside.
function getrsvpSetupHandler(app) {
    app.post('/api/getrsvp', (req, res) => {
        try {
            const body = req.body;
            if (!body.nonce) {
                res.status(400).json({ errorMessage: 'invalid body, no nonce' });
                return;
            }
            const nonce = new Uint8Array(Buffer.from(body.nonce, 'base64').buffer);
            if (checkNonce(nonce)) {
                res.status(200).json(rsvpData);
            }
            else {
                res.status(401).json({ errorMessage: 'invalid nonce' });
            }
        }
        catch (e) {
            res.status(500).json({
                errorMessage: JSON.stringify(e, Object.getOwnPropertyNames(e)),
            });
        }
    });
}
function authSetupHandler(app) {
    app.get('/api/auth', (_, res) => {
        try {
            const nonce = randombytes_buf(32);
            const cipherText = crypto_box_seal(nonce, pk);
            nonces.push({ nonce, time: new Date().getTime() });
            res.json({ nonce: Buffer.from(cipherText).toString('base64') });
        }
        catch (e) {
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
            const inviteId = rsvpData.people[name];
            if (inviteId === undefined) {
                res.status(400).json({
                    errorMessage: 'could not find anyone with that name',
                });
                return;
            }
            if (rsvpData.invites[inviteId] === undefined) {
                res.status(500).json({ errorMessage: 'data unexpectedly missing' });
                return;
            }
            res.status(200).json({
                responded: rsvpData.invites[inviteId].responded,
                peopleOnInvite: Object.entries(rsvpData.people).flatMap((e) => e[1] === inviteId ? e[0] : []),
                invitedToAfternoon: rsvpData.invites[inviteId].invitedToAfternoon,
            });
        }
        catch (e) {
            console.error(e);
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
                return;
            }
            contactFormRequests[JSON.stringify(body)] = time;
            const result = await sendContactFormEmail(body.message, body.subject, body.name, body.email);
            res.status(200).json(result);
        }
        catch (e) {
            contactFormRequests[JSON.stringify(body)] =
                time - DUPE_TIMEOUT_SUCCESS + DUPE_TIMEOUT_FAIL;
            console.log(e);
            res.status(500).json({
                errorMessage: JSON.stringify(e, Object.getOwnPropertyNames(e)),
            });
        }
    });
}
main();
