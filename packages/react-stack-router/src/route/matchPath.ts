export type PatternType =
    | "parameter" // :abc
    | "union" // a|b|c
    | "wildcard" // *
    | "fallback" // **
    | "normal";

export interface MatchResult {
    param: {[key: string]: string};
    wildcard?: string;
    any?: string;
}

export function patternType(pattern: string): PatternType {
    if (pattern[0] === ":") {
        return pattern.includes("(") && pattern[pattern.length - 1] === ")" ? "union" : "parameter";
    } else if (pattern === "*") {
        return "wildcard";
    } else if (pattern === "**") {
        return "fallback";
    } else {
        return "normal";
    }
}

// This match a single segments of path, it is not testable with string contains '/'.
// If you need more complex url pattern matching, just use `path-to-regexp` and 'regexparam'
export function matchPathSegment(pattern: string, pathSegment: string): MatchResult | null;
export function matchPathSegment(pattern: string, pathSegment: string, type?: PatternType): MatchResult | null;
export function matchPathSegment(pattern: string, pathSegment: string, type?: PatternType): MatchResult | null {
    const t = type ?? patternType(pattern);
    switch (t) {
        case "normal":
            return pattern === pathSegment ? {param: {}} : null;
        case "parameter":
            return {param: {[pattern.slice(1)]: pathSegment}};
        case "wildcard":
            return {param: {}, wildcard: pathSegment};
        case "fallback":
            return {param: {}, any: pathSegment};
        case "union": {
            const start = pattern.indexOf("(");
            const name = pattern.slice(1, start);
            try {
                const matches = new RegExp(`^${pattern.slice(start)}$`).exec(pathSegment);
                return matches ? {param: {[name]: matches[0]}} : null;
            } catch (e) {
                throw new Error(`[react-stack-router]: Invalid union url pattern ${pattern}`);
            }
        }
    }
}
