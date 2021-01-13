// TODO/Lok: remove this file, put to devtool-util/NamingUtil, and can also be reused by `ModuleGenerator`

export function isKebabCase(string: string) {
    return /^[a-z-]+$/.test(string);
}

export function kebabToCamelCase(string: string) {
    return string.replace(/([-_][a-z])/g, group => group.toUpperCase().replace("-", "").replace("_", ""));
}
