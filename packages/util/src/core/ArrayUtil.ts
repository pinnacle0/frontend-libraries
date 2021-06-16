function sum(numbers: ReadonlyArray<number>): number {
    return numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
}

function sumByKey<T>(array: ReadonlyArray<T>, key: keyof T): number {
    let sum = 0;
    array.forEach(_ => (sum = sum + (Number(_[key]) || 0)));
    return sum;
}

/**
 * If element exists in array, it will return a new array without this element.
 * If element not exists in array, it will return a new array with this element in the last.
 */
function toggleElement<T>(array: ReadonlyArray<T>, element: T): T[] {
    const index = array.indexOf(element);
    if (index >= 0) {
        const clonedArray = [...array];
        clonedArray.splice(index, 1);
        return clonedArray;
    } else {
        return [...array, element];
    }
}

function areSame<T>(a: ReadonlyArray<T>, b: ReadonlyArray<T>, compareOrdering: boolean): boolean {
    if (a.length !== b.length) {
        return false;
    }

    if (compareOrdering) {
        return a.every((_, index) => b[index] === _);
    } else {
        return a.every(_ => b.includes(_)) && b.every(_ => a.includes(_));
    }
}

/**
 * Sort `array` by `priorityLists` ordering.
 * If some element is not specified in `priorityLists`, it will be put to the last, in the original ordering.
 * If more than 1 `priorityLists` are provided, the latter takes precedence over the previous.
 */
function sortBy<T>(array: ReadonlyArray<T>, ...priorityLists: Array<ReadonlyArray<T>>): T[] {
    const reversedPrioritySet = priorityLists.reduce((prev, curr) => [...curr, ...prev], []);
    const mergedPriorityList = [...new Set(reversedPrioritySet)];

    if (mergedPriorityList.length > 0) {
        return [...array].sort((a, b) => {
            const aIndex = mergedPriorityList.indexOf(a);
            const bIndex = mergedPriorityList.indexOf(b);
            if (aIndex < 0 && bIndex < 0) {
                return 0;
            } else if (aIndex < 0) {
                // b should be before a
                return 1;
            } else if (bIndex < 0) {
                // a should be before b
                return -1;
            } else {
                return aIndex - bIndex;
            }
        });
    } else {
        return array as T[];
    }
}

/**
 * Sort `array` by the `priorityLists` by specified `key` ordering.
 * If some element is not specified in `priorityLists`, it will be put to the last, in the original ordering.
 * If more than 1 `priorityLists` are provided, the latter takes precedence over the previous.
 */
function sortByKey<T extends object, K extends keyof T>(array: ReadonlyArray<T>, key: K, ...priorityLists: Array<ReadonlyArray<T[K]>>): T[] {
    const reversedPrioritySet = priorityLists.reduce((prev, curr) => [...curr, ...prev], []);
    const mergedPriorityList = [...new Set(reversedPrioritySet)];

    if (mergedPriorityList.length > 0) {
        return [...array].sort((a, b) => {
            const aIndex = mergedPriorityList.findIndex(_ => _ === a[key]);
            const bIndex = mergedPriorityList.findIndex(_ => _ === b[key]);
            if (aIndex < 0 && bIndex < 0) {
                return 0;
            } else if (aIndex < 0) {
                // b should be before a
                return 1;
            } else if (bIndex < 0) {
                // a should be before b
                return -1;
            } else {
                return aIndex - bIndex;
            }
        });
    } else {
        return array as T[];
    }
}

function chunk<T>(array: ReadonlyArray<T>, sizeOrShape: number | ReadonlyArray<number>): T[][] {
    let shape: ReadonlyArray<number>;
    if (typeof sizeOrShape === "number") {
        const size = sizeOrShape;
        if (!(Number.isInteger(size) && size >= 1)) {
            throw new Error(`[util] ArrayUtil.chunk: number group size must be integer and >= 1`);
        }
        shape = Array(Math.ceil(array.length / size)).fill(size); // It's ok to call `array.slice` with `end` larger than `array.length`
    } else {
        shape = sizeOrShape;
        const shapeTotal = sum(sizeOrShape);
        if (shapeTotal !== array.length) {
            throw new Error(`[util] ArrayUtil.chunk: number group shape total ${shapeTotal} does not equal to array length ${array.length}`);
        }
        if (sizeOrShape.some(_ => !(Number.isInteger(_) && _ >= 0))) {
            throw new Error(`[util] ArrayUtil.chunk: number group length must be integer and >= 0`);
        }
    }
    const result: T[][] = [];
    let offset = 0;
    shape.forEach(size => {
        result.push(array.slice(offset, offset + size));
        offset += size;
    });
    return result;
}

function generate<T>(length: number, generator: T | ((index: number) => T)): T[] {
    const result: T[] = [];
    for (let i = 0; i < length; i++) {
        result.push(typeof generator === "function" ? (generator as (index: number) => T)(i) : generator);
    }
    return result;
}

function toObject<T, V>(array: ReadonlyArray<T>, mapperCallback: (item: T, index: number) => [string, V]): {[key: string]: V} {
    const result: {[key: string]: V} = {};
    array.forEach((item, index) => {
        const mappedKV = mapperCallback(item, index);
        result[mappedKV[0]] = mappedKV[1];
    });
    return result;
}

function hasIntersection<T>(a: ReadonlyArray<T>, b: ReadonlyArray<T>): boolean {
    return a.some(_ => b.includes(_));
}

/**
 * Accepts a list of item and a callback, maps each item with the callback,
 * then removes value of `null`, `undefined`, `NaN` from the resulting list.
 * Other falsy values are NOT removed.
 */
function compactMap<T, V>(array: ReadonlyArray<T>, callback: (item: T, index: number) => V): Array<NonNullable<V>> {
    return array.map(callback).filter(_ => _ !== null && _ !== undefined && (typeof _ !== "number" || !Number.isNaN(_))) as Array<NonNullable<V>>;
}

function range(size: number, fromIndex: number = 0) {
    const result: number[] = [];
    for (let i = fromIndex; i < fromIndex + size; i++) {
        result.push(i);
    }
    return result;
}

export const ArrayUtil = Object.freeze({
    sum,
    sumByKey,
    toggleElement,
    areSame,
    sortBy,
    sortByKey,
    chunk,
    generate,
    toObject,
    hasIntersection,
    compactMap,
    range,
});
