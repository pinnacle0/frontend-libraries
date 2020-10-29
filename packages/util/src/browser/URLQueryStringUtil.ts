function map(): {[key: string]: string} {
    // TODO/Lok
    const search = location.search;
    return {};
}

function get(key: string): string | null {
    return map()[key] ?? null;
}

export const URLQueryStringUtil = Object.freeze({
    map,
    get,
});
