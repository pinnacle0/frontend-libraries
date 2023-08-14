function clamp(value: number, min: number, max: number): number {
    if (min > max) throw new Error(`[util] NumberUtil.clamp: min(${min}) must <= max(${max})`);
    return Math.max(min, Math.min(max, value));
}

function max(list: Array<number | undefined | null>): number {
    return Math.max(...list.map(_ => (_ === undefined || _ === null ? -Infinity : _)));
}

function min(list: Array<number | undefined | null>): number {
    return Math.min(...list.map(_ => (_ === undefined || _ === null ? Infinity : _)));
}

/**
 * For a valid number, like 4422.1, it will be formatted as "4,422.1"
 */
function formatWithComma(value: number | null): string {
    if (value !== null && Number.isFinite(value)) {
        const parts = value.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    } else {
        return "-";
    }
}

/**
 * Safe a number with correct decimal places
 * @param value unsafe number
 * @param maxScale decimal places
 * @returns safe number with correct decimal places
 */
function safeNumber(value: number, maxScale: number) {
    return Number(value.toFixed(maxScale));
}

function rounding(value: number, algorithm: "round" | "ceil" | "floor", maxScale: number): number {
    if (!Number.isInteger(maxScale) || maxScale < 0 || maxScale > 10) throw new Error("[util] NumberUtil.rounding: maxScale must be an integer between [0, 10]");
    if (!Number.isFinite(value)) return value;

    /**
     * Take "4.975" as an example.
     * First, we split the number by the decimal point to get ["4", "975"].
     * Then, we find the adjustmentScale ("975".length) to be 3. This means 4.975 * 10^3 is an integer.
     * Now, we compare the maxScale with adjustmentScale.
     * If maxScale is larger, then value * 10^maxScale is always integer which is perfect.
     * If maxScale is smaller, then we first need to multiply the value by 10^adjustmentScale to make it an integer.
     * Note: we need to check if adjustment is safe by checking against Number.MAX_SAFE_INTEGER.
     * Then, we divide the number by the difference between adjustmentScale and maxScale to get the correct rounding position.
     * For example, we have maxScale = 2. We have adjustmentScale (3) > maxScale (2).
     * Therefore, we first get 4.975 * 10^3 = 4975. Then, we get 4975 / 10^(3 - 2) = 497.5 and we round this number.
     * In the end, we divide this number by 10^maxScale to obtained the final answer, i.e. 498 / 10^2 = 4.98 (assume algorithm is "round").
     */

    // for passing exponential notation string to it
    const func = Math[algorithm] as any;

    const precision = maxScale == null ? 0 : maxScale >= 0 ? Math.min(maxScale, 292) : Math.max(maxScale, -292);
    if (precision) {
        // Shift with exponential notation to avoid floating-point issues.
        let pair = `${value}e`.split("e");
        const roundedValue = func(`${pair[0]}e${+pair[1] + precision}`);
        pair = `${roundedValue}e`.split("e");
        return +`${pair[0]}e${+pair[1] - precision}`;
    }
    return func(value);
}

function roundingToString(value: number, algorithm: "round" | "ceil" | "floor", scale: number): string {
    return rounding(value, algorithm, scale).toFixed(scale);
}

export const NumberUtil = Object.freeze({
    clamp,
    max,
    min,
    formatWithComma,
    rounding,
    roundingToString,
    safeNumber,
});
