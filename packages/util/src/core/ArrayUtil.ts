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
 * Sort `array` by `priorityList` and optional `extraPriorityLists` ordering.<br>
 * If some element is not specified in the `priorityList` or `extraPriorityLists`, it will be put to the last, in the original ordering.<br>
 * If `extraPriorityLists` are provided, they will take precedence over `priorityList`.<br>
 * If more than 1 `extraPriorityLists` are provided, the latter takes precedence over the previous.<br>
 */
function sortBy<T>(array: ReadonlyArray<T>, priorityList: ReadonlyArray<T>, ...extraPriorityLists: Array<ReadonlyArray<T>>): T[] {
    const reversedExtraPriorityList = extraPriorityLists.reduce((prev, curr) => [...curr, ...prev], []);
    const mergedPriorityList = extraPriorityLists.length > 0 ? [...new Set([...reversedExtraPriorityList, ...priorityList])] : priorityList;

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
        return [...array];
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

function mapToObject<T, V>(array: ReadonlyArray<T>, mapperCallback: (item: T, index: number) => [string, V]): {[key: string]: V} {
    const result: {[key: string]: V} = {};
    array.forEach((item, index) => {
        const mappedKV = mapperCallback(item, index);
        result[mappedKV[0]] = mappedKV[1];
    });
    return result;
}

function fromStringEnum<EnumType extends {[P in keyof EnumType]: EnumType[P] & string}>(enumMap: EnumType): Array<EnumType[keyof EnumType]> {
    return Object.values(enumMap);
}

function hasIntersection<T>(a: ReadonlyArray<T>, b: ReadonlyArray<T>): boolean {
    return a.some(_ => b.includes(_));
}

/**
 * Accepts a list of item and a callback, maps each item with the callback,
 * then removes value of `null`, `undefined`, `NaN` from the resulting list.
 * Other falsy values are **NOT** removed.
 *
 * @param array    List of items to be filtered
 * @param callback Callback to transform item
 */
function compactMap<T, V>(array: ReadonlyArray<T>, callback: (item: T, index: number) => V): Array<NonNullable<V>> {
    return array.map(callback).filter(_ => _ !== null && _ !== undefined && (typeof _ !== "number" || !Number.isNaN(_))) as Array<NonNullable<V>>;
}

function enumByValue<EnumType extends {[P in keyof EnumType]: EnumType[P] & string}>(enumMap: EnumType, value: string): EnumType[keyof EnumType] | null {
    if (Object.values(enumMap).includes(value as any)) {
        return value as any;
    }
    return null;
}

export const ArrayUtil = Object.freeze({
    sum,
    sumByKey,
    toggleElement,
    areSame,
    generate,
    fromStringEnum,
    enumByValue,
    chunk,
    hasIntersection,
    compactMap,
    mapToObject,
    sortBy,
});
