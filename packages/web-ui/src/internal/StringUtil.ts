function interpolate(text: string, ...parameters: string[]): string {
    let result = text;
    for (let i = 0; i < parameters.length; i++) {
        result = result.replace(`{${i + 1}}`, parameters[i]);
    }
    return result;
}

/**
 * Similar to Number.toFixed, but it applies floor function instead of rounding.
 *
 * For example: (23, 2) -> 23.00
 * For example: (23.8888, 2) -> 23.88
 */
function numberToFloorFixed(value: number, scale: number): string {
    if (!Number.isInteger(scale) || scale < 0) {
        throw new Error("[util] TextUtil.numberToFloorFixed.scale must be integer and >= 0");
    }
    if (value !== null && Number.isFinite(value)) {
        const parts = value.toString().split(".");
        if (scale === 0) {
            return parts[0];
        } else {
            let fractionalPart = parts[1] || "";
            fractionalPart = fractionalPart.length > scale ? fractionalPart.substr(0, scale) : fractionalPart.padEnd(scale, "0");
            if (fractionalPart.length > scale) {
                return parts[0] + "." + fractionalPart.substr(0, scale);
            } else {
                return parts[0] + "." + fractionalPart.padEnd(scale, "0");
            }
        }
    } else {
        return "-";
    }
}

export const StringUtil = Object.freeze({
    interpolate,
    numberToFloorFixed,
});
