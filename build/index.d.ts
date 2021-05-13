/// <reference types="node" />
/**
 *
 * @param file Original file buffer
 * @param shardSize Size of each shard
 * @param totalShards Total number of shards, used to split the original file
 * @param partityShards Total number of parity shards desired
 * @returns
 */
export declare function encode(file: Buffer, shardSize: number, totalShards: number, partityShards: number): Promise<Uint8Array>;
/**
 *
 * @param input Entire file buffer WITH parity shards
 * @param totalShards Total number of original SHARDS (without parity)
 * @param parityShards Total number of parity shards
 * @param shardsAvailable Boolean array to
 * @returns
 */
export declare function reconstruct(input: Buffer | Uint8Array, totalShards: number, parityShards: number, shardsAvailable: boolean[]): Promise<Buffer | Uint8Array>;
export * as utils from './utils';
