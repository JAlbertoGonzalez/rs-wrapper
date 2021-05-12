import { ReedSolomonErasure } from "@subspace/reed-solomon-erasure.wasm";
import { expect } from "chai";

export async function encode(file: Buffer, shardSize: number, totalShards: number, partityShards: number) {
    const reedSolomonErasure = await ReedSolomonErasure.fromCurrentDirectory();

    const output = new Uint8Array(shardSize * (totalShards + partityShards));
    output.set(file.slice());

    reedSolomonErasure.encode(output, totalShards, partityShards);

    return output;
}

export async function reconstruct(input: Buffer | Uint8Array, totalShards: number, parityShards: number, shardsAvailable: boolean[]) {
    const reedSolomonErasure = await ReedSolomonErasure.fromCurrentDirectory();
    const result = reedSolomonErasure.reconstruct(input, totalShards, parityShards, shardsAvailable);
    return input;
}
