export function ab2b64(buf: ArrayBuffer) {
	return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

export function b642uint8array(str: string) {
	return Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
}
