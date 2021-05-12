import { expect } from 'chai'
import { encode } from '../src';

describe('should encode', () => {
    it('should encode like golang version', async () => {
        const input = Buffer.from("hello world hello world ");
        const expected = Buffer.from([
            104, 101, 108, 108, 111, 32,
            119, 111, 114, 108, 100, 32,
            104, 101, 108, 108, 111, 32,
            119, 111, 114, 108, 100, 32,
            157, 178, 83, 31, 48, 240,
            254, 93, 31, 89, 151, 184]);
        return encode(input, 2, 12, 6).then(result => {
            console.log(expected.length);
            expect(Buffer.from(result)).to.be.eql(expected);
        })
    })
})