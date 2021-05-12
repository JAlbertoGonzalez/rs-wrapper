"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
function shardSize(hops) {
    return constants_1.MIN_SHARD_SIZE * Math.pow(2, hops);
}
function determineShardSize(fileSize, accumulator) {
    if (accumulator === void 0) { accumulator = 0; }
    if (fileSize < 0) {
        return 0;
    }
    var hops = ((accumulator - constants_1.SHARD_MULTIPLE_BACK) < 0) ? 0 : accumulator - constants_1.SHARD_MULTIPLE_BACK;
    var byteMultiple = shardSize(accumulator);
    var check = fileSize / byteMultiple;
    if (check > 0 && check <= 1) {
        while (hops > 0 && shardSize(hops) > constants_1.MAX_SHARD_SIZE) {
            hops = hops - 1 <= 0 ? 0 : hops - 1;
        }
        return shardSize(hops);
    }
    if (accumulator > 41) {
        return 0;
    }
    return determineShardSize(fileSize, ++accumulator);
}
exports.default = determineShardSize;
