import { parse } from 'csv-parse/sync';
import { getNonce } from '../../client/src/Utils.js';
import { readFileSync } from 'fs';
import { randomUUID } from 'crypto';
async function main() {
    const content = readFileSync(`input.csv`);
    const sk = readFileSync('../../sk');
    const pk = readFileSync('../server/build/assets/pk');
    const keys = {
        adminKey: Uint8Array.from(sk),
        publicKey: Uint8Array.from(pk),
    };
    let records = parse(content, {
        bom: true,
        columns: true,
        skip_records_with_empty_values: true,
        skip_empty_lines: true,
        skip_records_with_error: true,
        skipEmptyLines: true,
        skipRecordsWithEmptyValues: true,
        skipRecordsWithError: true,
    });
    let nextIndex;
    let inviteIndex = 0;
    do {
        nextIndex = records.findIndex((e) => e['Invite'] !== String(inviteIndex));
        const body = {
            plusOnes: parseInt(records[0].Plusones),
            inviteId: randomUUID(),
            adminAuth: await getNonce(keys, 'http://localhost:8080/api/auth'),
            invitedToAfternoon: records[0].Afternoon === 'TRUE',
            people: records
                .slice(0, nextIndex === -1 ? undefined : nextIndex)
                .map((e) => ({ name: e.Name })),
        };
        try {
            const resp = await fetch('http://localhost:8080/api/updatersvp', {
                body: JSON.stringify(body),
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            const json = (await resp.json());
            if (!resp.ok || 'errorMessage' in json) {
                throw new Error('errorMessage' in json ? json.errorMessage : 'unknown error');
            }
        }
        catch (e) {
            console.error('Error when processing inviteIndex ' + inviteIndex);
            console.error(e);
        }
        records = records.slice(nextIndex);
        inviteIndex++;
    } while (nextIndex !== -1);
}
main();
