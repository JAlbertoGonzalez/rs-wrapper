const { ReedSolomonErasure } = require("@subspace/reed-solomon-erasure.wasm");

export async function encode(file: Buffer, shardSize: number, totalShards: number, partityShards: number) {
    const reedSolomonErasure = await ReedSolomonErasure.fromCurrentDirectory();

    const output = new Uint8Array(shardSize * (totalShards + partityShards));
    output.set(file.slice());

    reedSolomonErasure.encode(output, totalShards, partityShards);

    return output;
}

export async function recontruct() {

}
