function interpolate(text: string, ...parameters: string[]): string {
    let result = text;
    for (let i = 0; i < parameters.length; i++) {
        result = result.replace(`{${i + 1}}`, parameters[i]);
    }
    return result;
}

export const TextUtil = Object.freeze({
    interpolate,
});
