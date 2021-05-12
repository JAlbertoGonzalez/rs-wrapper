import { expect } from 'chai'
import { encode, reconstruct } from '../src';

describe('should encode', () => {
    it('should encode', async () => {
        const input = Buffer.from("hello world hello world ");
        const expectedResult = Buffer.from([
            104, 101, 108, 108, 111, 32,
            119, 111, 114, 108, 100, 32,
            104, 101, 108, 108, 111, 32,
            119, 111, 114, 108, 100, 32,
            157, 178, 83, 31, 48, 240,
            254, 93, 31, 89, 151, 184]);
        return encode(input, 2, 12, 6).then(result => {
            expect(Buffer.from(result)).to.be.eql(expectedResult);
        })
    });

    it('should decode', async () => {
        const input = Buffer.from("hello world hello world ");
        const encoded = await encode(input, 2, 12, 6);
        
        const corruptedShards = encoded.slice();
        corruptedShards[1] = 'x'.charCodeAt(0);
        corruptedShards[21] = 'y'.charCodeAt(0);
        corruptedShards[8] = 'z'.charCodeAt(0);
        
        return reconstruct(corruptedShards, 12, 6, [
            false, // byte 1 corrupted
            true,
            true,
            true,
            false, // byte 8 corrupted
            true,
            true,
            true,
            true,
            true,
            false, // byte 20 corrupted
            true,
            true,
            true,
            true,
            true,
            true,
            true,
        ]).then(res => {
            const result = Buffer.from(res).slice(0, 12 * 2)
            expect(result).to.be.eql(input);
        });
    })
})