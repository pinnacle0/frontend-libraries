import {HashUtil} from "./HashUtil";
import {ArrayUtil} from "./ArrayUtil";

function ofOne<T>(array: T[]): T {
    const length = array.length;
    if (length === 0) throw new Error(`[util] RandomUtil.ofOne: array must not be empty`);

    return array[Math.floor(Math.random() * length)];
}

function ofMany<T>(array: T[], size: number, keepOrdering: boolean): T[] {
    const length = array.length;
    if (size <= 0 || !Number.isSafeInteger(size)) throw new Error(`[util] RandomUtil.ofMany: invalid size value ${size}`);
    if (length < size) throw new Error(`[util] RandomUtil.ofMany: array must not be smaller than size, array size is ${length}`);

    const shuffledArray = array.slice();
    for (let i = length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[randomIndex]] = [shuffledArray[randomIndex], shuffledArray[i]];
    }

    const randomArray = shuffledArray.slice(0, size);
    if (keepOrdering) return ArrayUtil.sortBy(randomArray, array);
    else return randomArray;
}

function integerBetween(min: number, max: number): number {
    if (min > max) throw new Error(`[util] RandomUtil.integerBetween: min must <= max`);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function integersBetween(min: number, max: number, size: number, keepOrdering: boolean): number[] {
    if (size <= 0 || !Number.isSafeInteger(size)) throw new Error(`[util] RandomUtil.integersBetween: invalid size value ${size}`);
    if (min + size - 1 > max) throw new Error(`[util] RandomUtil.integersBetween: min+size-1 must <= max`);

    const range: number[] = [];
    for (let i = min; i <= max; i++) range.push(i);

    return ofMany(range, size, keepOrdering);
}

function pickItemByHash<T>(array: readonly T[], hashableData: string): T {
    if (array.length === 0) throw new Error(`[util] RandomUtil.pickItemByHash: array must not be empty`);

    const index = Math.abs(HashUtil.toInteger(hashableData)) % array.length;
    return array[index];
}

export const RandomUtil = Object.freeze({
    ofOne,
    ofMany,
    integerBetween,
    integersBetween,
    pickItemByHash,
});
