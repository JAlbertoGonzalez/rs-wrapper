import { ReedSolomonErasure } from "@subspace/reed-solomon-erasure.wasm";
import { expect } from "chai";
import errorCodes from './errorcodes'

/**
 *
 * @param file Original file buffer
 * @param shardSize Size of each shard
 * @param totalShards Total number of shards, used to split the original file
 * @param partityShards Total number of parity shards desired
 * @returns
 */
export async function encode(file: Buffer, shardSize: number, totalShards: number, partityShards: number) {
    const reedSolomonErasure = await ReedSolomonErasure.fromCurrentDirectory();

    const output = new Uint8Array(shardSize * (totalShards + partityShards));
    output.set(file.slice());

    const result = reedSolomonErasure.encode(output, totalShards, partityShards);

    if (result !== 0) {
        throw Error(errorCodes[result])
    }

    return output;
}

/**
 *
 * @param input Entire file buffer WITH parity shards
 * @param totalShards Total number of original SHARDS (without parity)
 * @param parityShards Total number of parity shards
 * @param shardsAvailable Boolean array to
 * @returns
 */
export async function reconstruct(input: Buffer | Uint8Array, totalShards: number, parityShards: number, shardsAvailable: boolean[]) {
    if (shardsAvailable.length !== totalShards + parityShards) {
        throw Error('Available shards do not match total shards');
    }
    const reedSolomonErasure = await ReedSolomonErasure.fromCurrentDirectory();
    const result = reedSolomonErasure.reconstruct(input, totalShards, parityShards, shardsAvailable);

    if (result !== 0) {
        throw Error(errorCodes[result]);
    }
    return input;
}
