import libsodium from 'libsodium-wrappers';
import { AuthRequestResponse } from './constants';

export function ab2b64(buf: ArrayBuffer) {
	return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

export function b642uint8array(str: string) {
	return Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
}

export async function getNonce(
	keys: {
		adminKey: Uint8Array;
		publicKey: Uint8Array;
	},
	url?: string
) {
	const nonceResp = await fetch(url ?? '/api/auth', {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
	const nonceBody = (await nonceResp.json()) as AuthRequestResponse;
	if (!nonceResp.ok || 'errorMessage' in nonceBody) {
		throw new Error(
			`Error ${nonceResp.status} - ${nonceResp.statusText}: ${
				'errorMessage' in nonceBody ? nonceBody.errorMessage : 'unknown cause'
			}`
		);
	}
	const decrypted = libsodium.crypto_box_seal_open(
		b642uint8array(nonceBody.nonce),
		keys.publicKey,
		keys.adminKey
	);
	return ab2b64(decrypted.buffer);
}
