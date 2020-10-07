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

export const ArrayUtil = Object.freeze({
    intersectionPercentage,
});
