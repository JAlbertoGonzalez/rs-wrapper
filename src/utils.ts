import { MAX_SHARD_SIZE, MIN_SHARD_SIZE, SHARD_MULTIPLE_BACK } from "./constants";

function shardSize(hops: number): number {
    return MIN_SHARD_SIZE * Math.pow(2, hops);
}

export function determineShardSize(fileSize: number, accumulator: number = 0): number {
    if (fileSize < 0) { return 0; }

    let hops = ((accumulator - SHARD_MULTIPLE_BACK) < 0) ? 0 : accumulator - SHARD_MULTIPLE_BACK;

    const byteMultiple = shardSize(accumulator);

    const check = fileSize / byteMultiple;

    if (check > 0 && check <= 1) {
        while (hops > 0 && shardSize(hops) > MAX_SHARD_SIZE) {
            hops = hops - 1 <= 0 ? 0 : hops - 1;
        }
        return shardSize(hops);
    }

    if (accumulator > 41) {
        return 0;
    }

    return determineShardSize(fileSize, ++accumulator);
}

export function determineParityShards(totalShards: number) {
    return Math.ceil(totalShards * 2 / 3);
}