function toInteger(data: string): number {
    // Ref Java String.hashCode implementation
    // https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
        const charCode = data.charCodeAt(i);
        hash = (hash << 5) - hash + charCode;
        hash = hash & hash;
    }
    return hash;
}

export const HashUtil = Object.freeze({
    toInteger,
});
