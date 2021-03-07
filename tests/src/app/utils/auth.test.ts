import {decryptPacketBody, encryptPacketBody} from "@src/app/utils/auth";
import {expect} from "chai";

describe('Auth tests', () => {

    const vectors = [
        {
            body: 'Pellentesque purus turpis, congue at malesuada quis, ornare quis libero.',
            key: 'SECRET'
        },
        {
            body: 'Nullam rhoncus nisl nec enim tristique, in luctus lacus elementum.',
            key: 'deadbeef'
        },
        {
            body: 'Sed scelerisque elit nec elit feugiat, eu porta ex sodales.',
            key: '1337d00d'
        },
        {
            body: 'Fusce ultricies nisl ut purus dictum, ut gravida dolor elementum.',
            key: 'baka!'
        }
    ];

    it('Encrypt/Decrypt tests', () => {
        vectors.forEach(vector => {
            const encrypted = encryptPacketBody(vector.body, vector.key);
            const decrypted = decryptPacketBody(encrypted, vector.key);

            expect(decrypted).to.equal(vector.body);
        });
    });

});
