/**
 * Return b's the occurrence percentage in a.
 * The ordering of a & b matters.
 */
function intersectionPercentage<T>(a: T[], b: T[]): number {
    if (a.length === 0) {
        return 0;
    }
    return (a.filter(_ => b.includes(_)).length / a.length) * 100;
}

function toObject<T, V>(array: ReadonlyArray<T>, mapperCallback: (item: T, index: number) => [string, V]): {[key: string]: V} {
    const result: {[key: string]: V} = {};
    array.forEach((item, index) => {
        const mappedKV = mapperCallback(item, index);
        result[mappedKV[0]] = mappedKV[1];
    });
    return result;
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

export const ArrayUtil = Object.freeze({
    intersectionPercentage,
    toObject,
    compactMap,
    toggleElement,
});
