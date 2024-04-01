import { b642uint8array, getNonce } from '../../client/src/Utils.js';
import { readFileSync, writeFileSync } from 'fs';
import libsodium from 'libsodium-wrappers';
import { stringify } from 'csv-stringify/sync';
async function main() {
    const sk = readFileSync('../../sk');
    const pk = readFileSync('../server/build/assets/pk');
    const keys = {
        adminKey: Uint8Array.from(sk),
        publicKey: Uint8Array.from(pk),
    };
    try {
        const requestBody = {
            nonce: await getNonce(keys, 'http://localhost:8080/api/auth'),
        };
        const resp = await fetch('http://localhost:8080/api/getrsvp', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
        const body = (await resp.json());
        if (!resp.ok || 'errorMessage' in body) {
            console.error(`Error ${resp.status} - ${resp.statusText}: ${'errorMessage' in body ? body.errorMessage : 'unknown cause'}`);
            return;
        }
        const result = { ...body };
        for (const [inviteId, invite] of Object.entries(body)) {
            const decryptedInviteData = libsodium.crypto_box_seal_open(b642uint8array(invite.data), keys.publicKey, keys.adminKey);
            const decoded = new TextDecoder().decode(decryptedInviteData);
            const json = JSON.parse(decoded);
            result[inviteId].data = json;
        }
        const people = Object.values(result).flatMap((e) => e.data.people ?? []);
        const invites = Object.entries(result).map((e) => ({
            inviteId: e[0],
            doNotEmail: e[1].doNotEmail,
            invitedToAfternoon: e[1].invitedToAfternoon,
            peopleOnInvite: e[1].peopleOnInvite,
            submittedBy: e[1].submittedBy,
            email: e[1].data.email,
            time: e[1].data.time,
            ip: e[1].data.ip,
        }));
        console.log(people);
        const peopleStr = stringify(people, {
            header: true,
            bom: true,
            columns: [
                'afternoon',
                'evening',
                'ceremony',
                'dietary',
                'comments',
                'noAlcohol',
                'vegetarian',
                'pescetarian',
                'name',
            ],
        });
        const invitesStr = stringify(invites, { header: true, bom: true });
        writeFileSync('people.csv', peopleStr);
        writeFileSync('invites.csv', invitesStr);
    }
    catch (e) {
        console.error(e);
    }
}
main();
