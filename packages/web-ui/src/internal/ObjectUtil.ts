function isEmpty(object: object): boolean {
    return Object.keys(object).length === 0;
}

export const ObjectUtil = Object.freeze({
    isEmpty,
});
