function haveCapturingGroup(pattern: RegExp): boolean {
    return countNonNamedGroup(pattern) > 0 || listNamedGroup(pattern).length > 0;
}

function countNonNamedGroup(pattern: RegExp): number {
    const source = pattern.source;
    return source.match(/(?<!\\)\((?!\?)/g)?.length || 0;
}

function listNamedGroup(pattern: RegExp): string[] {
    const source = pattern.source;
    return source.match(/\(\?<([^>]+)>/g)?.map(match => match.slice(3, -1)) || [];
}

export const RegExpUtil = Object.freeze({
    haveCapturingGroup,
    countNonNamedGroup,
    listNamedGroup,
});
