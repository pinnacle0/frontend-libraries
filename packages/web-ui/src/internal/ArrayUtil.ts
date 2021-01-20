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

export const ArrayUtil = Object.freeze({
    intersectionPercentage,
    toObject,
    compactMap,
});
