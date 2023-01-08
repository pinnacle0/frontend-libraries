export type PatternType =
    | "parameter" // :abc
    | "union" // a|b|c
    | "wildcard" // *
    | "normal";

export function patternType(pattern: string): PatternType {
    if (pattern[0] === ":") {
        return pattern.includes("(") && pattern[pattern.length - 1] === ")" ? "union" : "parameter";
    } else if (pattern === "*") {
        return "wildcard";
    }
    return "normal";
}

interface MatchResult {
    params: {[key: string]: string};
}

// This only match a single segments of path, it is not testable with string contains '/'.
// If you need more complex url pattern matching, just use `path-to-regexp` and 'regexparam'
export function matchPath(pattern: string, path: string): MatchResult | null;
export function matchPath(pattern: string, path: string, type?: PatternType): MatchResult | null;
export function matchPath(pattern: string, path: string, type?: PatternType): MatchResult | null {
    const t = type ?? patternType(pattern);
    switch (t) {
        case "normal":
            return pattern === path ? {params: {}} : null;
        case "parameter":
            return {params: {[pattern.slice(1)]: path}};
        case "wildcard":
            return {params: {"*": path}};
        case "union": {
            const start = pattern.indexOf("(");
            const name = pattern.slice(1, start);
            try {
                const matches = new RegExp(`^${pattern.slice(start)}$`).exec(path);
                return matches ? {params: {[name]: matches[0]}} : null;
            } catch (e) {
                throw new Error(`[react-stack-router]: Invalid union url pattern ${pattern}`);
            }
        }
    }
}
