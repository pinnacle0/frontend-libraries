import {minimatch} from "minimatch";

function isMatch(target: string, patterns: string[]): boolean {
    let matched = false;
    for (const pattern of patterns) {
        matched = minimatch(target, pattern);
        if (matched) return matched;
    }
    return matched;
}

function toRegex(patterns: string[]): RegExp {
    return new RegExp(
        patterns
            .map(_ => minimatch.makeRe(_))
            .filter((_): _ is RegExp => _ !== false)
            .map(_ => _.source)
            .join("|")
    );
}

export const globUtil = Object.freeze({
    isMatch,
    toRegex,
});
