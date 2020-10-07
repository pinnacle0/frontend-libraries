import {HashUtil} from "./HashUtil";

function fromArray<T>(array: T[]): T | null {
    const length = array.length;
    return length > 0 ? array[Math.floor(Math.random() * length)] : null;
}

function integerBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function pickItemByHash<T>(array: readonly T[], hashableData: string): T {
    if (array.length === 0) {
        throw new Error(`[util] pickItemByHash: Cannot pick from empty array`);
    }
    const index = Math.abs(HashUtil.toInteger(hashableData)) % array.length;
    return array[index];
}

export const RandomUtil = Object.freeze({
    fromArray,
    integerBetween,
    pickItemByHash,
});
