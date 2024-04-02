import { parse } from 'csv-parse/sync';
import { getNonce } from '../../client/src/Utils.js';
import { readFileSync } from 'fs';
import {
	UpdateRSVPRequestBody,
	UpdateRSVPRequestResponse,
} from '../../client/src/constants.js';
import { randomUUID } from 'crypto';

async function main() {
	const URL = 'https://matthewandadelewedding.co.uk'; //'http://localhost:8080';
	const content = readFileSync(`input.csv`);
	const sk = readFileSync('../../sk');
	const pk = readFileSync('../server/build/server/src/assets/pk');
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
	}) as {
		Name: string;
		Invite: string;
		Afternoon: string;
		Plusones: string;
	}[];
	let nextIndex;
	let inviteIndex = 0;
	do {
		nextIndex = records.findIndex((e) => e['Invite'] !== String(inviteIndex));

		const body: UpdateRSVPRequestBody = {
			plusOnes: parseInt(records[0].Plusones),
			inviteId: randomUUID(),
			adminAuth: await getNonce(keys, `${URL}/api/auth`),
			invitedToAfternoon: records[0].Afternoon === 'TRUE',
			people: records
				.slice(0, nextIndex === -1 ? undefined : nextIndex)
				.map((e) => ({ name: e.Name })),
		};
		try {
			const resp = await fetch(`${URL}/api/updatersvp`, {
				body: JSON.stringify(body),
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
			});
			const json = (await resp.json()) as UpdateRSVPRequestResponse;
			if (!resp.ok || 'errorMessage' in json) {
				throw new Error(
					'errorMessage' in json ? json.errorMessage : 'unknown error'
				);
			}
		} catch (e) {
			console.error('Error when processing inviteIndex ' + inviteIndex);
			console.error(e);
		}

		records = records.slice(nextIndex);
		inviteIndex++;
	} while (nextIndex !== -1);
}
main();
