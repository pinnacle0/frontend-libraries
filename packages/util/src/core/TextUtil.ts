function truncate(text: string, maxLength: number, suffix: string = "…") {
    /**
     * Use Array.from, instead of text.length, because of emojis
     * E.g: "🐱".length === 2
     *
     * This works for most emojis, but not every.
     * E.g: 🇺🇸 is an exception, whose length is 4.
     */
    if (maxLength <= 0 || !Number.isSafeInteger(maxLength)) {
        throw new Error(`[util] TextUtil.truncate.maxLength must be a positive integer`);
    }
    const chars = Array.from(text);
    return chars.length > maxLength ? chars.slice(0, maxLength).join("") + suffix : text;
}

/**
 * For example: ("abcde", 3, " ") -> "abc de"
 * For example: ("abcde", 1, "|") -> "a|b|c|d|e"
 */
function splitByLength(text: string, charLength: number, delimiter: string): string {
    if (!Number.isInteger(charLength) || charLength < 1) {
        throw new Error("[util] TextUtil.splitByLength.charLength must be >= 1");
    }
    const matchedResult = text.match(new RegExp(`.{1,${charLength}}`, "g"));
    return matchedResult ? matchedResult.join(delimiter) : text;
}

function interpolate(text: string, ...parameters: string[]): string {
    let result = text;
    for (let i = 0; i < parameters.length; i++) {
        result = result.replace(`{${i + 1}}`, parameters[i]);
    }
    return result;
}

export const TextUtil = Object.freeze({
    truncate,
    interpolate,
    splitByLength,
});
