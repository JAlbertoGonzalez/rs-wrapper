import { expect } from 'chai'
import { encode, reconstruct } from '../src';
import crypto from 'crypto';
import { determineParityShards, determineShardSize } from '../src/utils'

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
        const SHARD_SIZE = 2;
        const TOTAL_SHARDS = 12;
        const TOTAL_PARITY_SHARDS = 6;

        const input = Buffer.from("hello world hello world ");
        const encoded = await encode(input, SHARD_SIZE, TOTAL_SHARDS, TOTAL_PARITY_SHARDS);

        const corruptedShards = encoded.slice();
        corruptedShards[1] = 'x'.charCodeAt(0);
        corruptedShards[21] = 'y'.charCodeAt(0);
        corruptedShards[8] = 'z'.charCodeAt(0);

        return reconstruct(corruptedShards, TOTAL_SHARDS, TOTAL_PARITY_SHARDS, [
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
            const result = Buffer.from(res).slice(0, TOTAL_SHARDS * SHARD_SIZE)
            expect(result).to.be.eql(input);
        });
    });

})

describe('benchmark', () => {
    it('should 11x16x1GB', function (done) {
        this.timeout(1000000)
        const newData = crypto.randomBytes(1024 * 1024 * 1024);
        const FILE_SIZE = newData.length;
        const SHARD_SIZE = determineShardSize(FILE_SIZE);
        const TOTAL_SHARDS = Math.ceil(FILE_SIZE / SHARD_SIZE);
        const TOTAL_PARITY = determineParityShards(TOTAL_SHARDS);
        console.log('SE VA A EJECUTAR', SHARD_SIZE, TOTAL_SHARDS, TOTAL_PARITY)
        encode(newData, SHARD_SIZE, TOTAL_SHARDS, TOTAL_PARITY).then(() => {
            console.log('HA ACABADO');
            done();
        });
    });
});
