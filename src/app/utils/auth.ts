import md5 from "md5";
import pako from "pako";
import {base64StringToByteArray, byteArrayToBase64String, rc4} from "@app/utils/crypt";

export const decryptPacketBody = (body: string, key: string): string => {
    const hash = md5(key);
    const rightHash = md5(hash.substr(16));
    const rc4Key = rightHash + md5(rightHash);

    if (body.startsWith('#')) {
        body = body.substr(1);

        const bytes = base64StringToByteArray(body);
        const decryptedBytes = rc4(bytes, rc4Key);
        const decompressedBytes = pako.ungzip(decryptedBytes.slice(26));
        return new TextDecoder().decode(decompressedBytes);
    } else {
        const bytes = base64StringToByteArray(body);
        const decryptedBytes = rc4(bytes, rc4Key);
        const decodedBytes = new TextDecoder().decode(decryptedBytes);
        return decodedBytes.slice(26);
    }
};

export const encryptPacketBody: (body: string, key: string) => string = (body: string, key: string) => {
    const compressedBody = pako.gzip(body);

    const hash = md5(key);
    const leftHash = md5(hash.substr(0, 16));
    const rightHash = md5(hash.substr(16, 16));
    const rc4Key = rightHash + md5(rightHash);

    const timestamp = new TextEncoder().encode(Math.round(Date.now() / 1000) + 3600 + '');
    const signature = md5(Array.from(compressedBody).concat(Array.from(new TextEncoder().encode(leftHash)))).substr(0, 16);

    const bytes = new Uint8Array(compressedBody.length + 26);
    bytes.set(timestamp);
    bytes.set(new TextEncoder().encode(signature), 10);
    bytes.set(compressedBody, 26);

    const encryptedBytes = rc4(bytes, rc4Key);
    const encryptedBase64 = byteArrayToBase64String(encryptedBytes);
    return '#' + encryptedBase64;
};
