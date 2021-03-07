import {fromByteArray, toByteArray} from "base64-js"

const keySchedulingAlgorithm: (key: Uint8Array) => Uint8Array = (key: Uint8Array) => {
    const sPermutation = Uint8Array.from([...Array(256).keys()]);

    let j = 0;
    for (let i = 0; i < 256; ++i) {
        j = (j + sPermutation[i] + key[i % key.length]) % 256;
        [sPermutation[j], sPermutation[i]] = [sPermutation[i], sPermutation[j]];
    }

    return sPermutation;
};

export const rc4: (bytes: Uint8Array, key: string) => Uint8Array = (bytes: Uint8Array, key: string) => {
    const sPermutation = keySchedulingAlgorithm(Buffer.from(key, 'utf-8'));
    const ciphertext = new Uint8Array(bytes.length);

    let i = 0;
    let j = 0;

    for (let kIndex = 0; kIndex < bytes.length; ++kIndex) {
        i = (i + 1) % 256;
        j = (j + sPermutation[i]) % 256;

        [sPermutation[i], sPermutation[j]] = [sPermutation[j], sPermutation[i]];
        ciphertext[kIndex] = bytes[kIndex] ^ sPermutation[(sPermutation[i] + sPermutation[j]) % 256];
    }

    return ciphertext;
};

export const base64StringToByteArray: (base64: string) => Uint8Array = (base64: string) => {
    return toByteArray(base64 + '='.repeat(base64.length % 4 ? 4 - base64.length % 4 : 0));
}

export const byteArrayToBase64String: (bytes: Uint8Array) => string = (bytes: Uint8Array) => {
    return fromByteArray(bytes).replace(/=/g, '');
}
