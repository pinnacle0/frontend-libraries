export type PatternType =
    | "parameter" // :abc
    | "union" // a|b|c
    | "wildcard" // *
    | "normal";

export function patternType(path: string): PatternType {
    if (path[0] === ":") {
        return path.includes("(") && path[path.length - 1] === ")" ? "union" : "parameter";
    } else if (path === "*") {
        return "wildcard";
    }
    return "normal";
}

interface MatchResult {
    param: {[key: string]: string};
}

// This only match a single segments of path, it is not testable with string contains '/'.
// If you need more complex url pattern matching, just use `path-to-regexp` and 'regexparam'
export function matchPath(pattern: string, path: string): MatchResult | null;
export function matchPath(pattern: string, path: string, type?: PatternType): MatchResult | null;
export function matchPath(pattern: string, path: string, type?: PatternType): MatchResult | null {
    const t = type ?? patternType(pattern);
    switch (t) {
        case "normal":
            return pattern === path ? {param: {}} : null;
        case "parameter":
            return {param: {[pattern.slice(1)]: path}};
        case "wildcard":
            return {param: {"*": path}};
        case "union": {
            const start = pattern.indexOf("(");
            const name = pattern.slice(1, start);
            try {
                const matches = new RegExp(`^${pattern.slice(start)}$`).exec(path);
                return matches ? {param: {[name]: matches[0]}} : null;
            } catch (e) {
                throw new Error(`[react-stack-router]: Invalid union url pattern ${pattern}`);
            }
        }
    }
}
