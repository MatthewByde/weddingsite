export function ab2b64(buf: ArrayBuffer) {
	return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

export function str2ab(str: string) {
	var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
	var bufView = new Uint16Array(buf);
	for (var i = 0, strLen = str.length; i < strLen; i++) {
		bufView[i] = str.charCodeAt(i);
	}
	return buf;
}

export async function sha512(str: string) {
	return ab2b64(await crypto.subtle.digest('SHA-512', str2ab(str)));
}
