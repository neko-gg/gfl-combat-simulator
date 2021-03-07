import {base64StringToByteArray, byteArrayToBase64String, rc4} from "@src/app/utils/crypt";
import {expect} from 'chai';

describe('Crypt tests', () => {

    describe('RC4 tests', () => {
        const wrongKey = 'OwO senpai, what is this key?';

        const vectors = [
            {
                plain: new Uint8Array([108, 111, 114, 101, 109, 32, 105, 112, 115, 117, 109, 32, 100, 111, 108, 111, 114, 32, 115, 105, 116, 32, 97, 109, 101, 116]),
                key: 'SECRET',
                cypher: new Uint8Array([240, 1, 30, 26, 98, 0, 74, 184, 145, 19, 209, 147, 5, 109, 137, 104, 222, 73, 114, 100, 167, 127, 23, 166, 157, 160])
            },
            {
                plain: new Uint8Array([108, 111, 114, 101, 109, 32, 105, 112, 115, 117, 109, 32, 100, 111, 108, 111, 114, 32, 115, 105, 116, 32, 97, 109, 101, 116]),
                key: 'de4dbeef',
                cypher: new Uint8Array([62, 189, 21, 114, 165, 111, 116, 76, 174, 28, 50, 88, 127, 247, 229, 163, 158, 83, 226, 107, 12, 62, 255, 206, 251, 132])
            }
        ];

        it('plain -> cypher', () => {
            vectors.forEach(vector => expect(rc4(vector.plain, vector.key)).to.eql(vector.cypher));
        });

        it('cypher -> plain', () => {
            vectors.forEach(vector => expect(rc4(vector.cypher, vector.key)).to.eql(vector.plain));
        });

        it('wrong key, plain -> cypher', () => {
            vectors.forEach(vector => expect(rc4(vector.plain, wrongKey)).to.not.eql(vector.cypher));
        });

        it('wrong key, cypher -> plain', () => {
            vectors.forEach(vector => expect(rc4(vector.cypher, wrongKey)).to.not.eql(vector.plain));
        });
    });

    describe('Base64 tests', () => {
        const vectors = [
            {
                base64: 'TnVsbGEgaWQgZ3JhdmlkYSBhdWd1ZSwgZXUgY3Vyc3VzIGFyY3Uu',
                bytes: new Uint8Array([78, 117, 108, 108, 97, 32, 105, 100, 32, 103, 114, 97, 118, 105, 100, 97, 32, 97, 117, 103, 117, 101, 44, 32, 101, 117, 32, 99, 117, 114, 115, 117, 115, 32, 97, 114, 99, 117, 46])
            },
            {
                base64: 'U2VkIGZhdWNpYnVzIHR1cnBpcyBudW5jLg==',
                bytes: new Uint8Array([83, 101, 100, 32, 102, 97, 117, 99, 105, 98, 117, 115, 32, 116, 117, 114, 112, 105, 115, 32, 110, 117, 110, 99, 46])
            }
        ];

        it('base64 -> bytes', () => {
            vectors.forEach(vector => expect(base64StringToByteArray(vector.base64)).to.eql(vector.bytes));
        });

        it('bytes -> base64', () => {
            vectors.forEach(vector => {
                const base64 = byteArrayToBase64String(vector.bytes);
                expect(base64).to.equal(vector.base64.replace(/=/g, ''));
                expect(base64).to.not.match(/.*=/);
            });
        });

    });

});
