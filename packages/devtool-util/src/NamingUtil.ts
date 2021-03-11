function isKebabCase(string: string): boolean {
    return /^[a-z]+(-[a-z]+)*$/.test(string);
}

function isSnakeCase(string: string): boolean {
    return /^[a-z]+(_[a-z]+)*$/.test(string);
}

function toCamelCase(string: string) {
    if (!(isKebabCase(string) || isSnakeCase(string))) {
        throw new Error("[NamingUtil]: toCamelCase must be called with kebab case or snake case");
    }
    return string.replace(/([-_][a-z])/g, group => group.toUpperCase().replace("-", "").replace("_", ""));
}

export const NamingUtil = Object.freeze({
    isKebabCase,
    isSnakeCase,
    toCamelCase,
});
