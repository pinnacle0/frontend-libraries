function clamp(value: number, min: number, max: number): number {
    if (min > max) {
        throw new Error(`[util] NumberUtil.clamp min(${min}) must be <= max(${max})`);
    }
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

function rounding(value: number, algorithm: "round" | "ceil" | "floor", maxScale: number): number {
    if (!Number.isInteger(maxScale) || maxScale < 0 || maxScale > 10) {
        throw new Error("[util] NumberUtil.rounding maxScale must be an integer in range [0, 10]");
    }
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
    const parts = Number(value).toString().split(".");
    const adjustmentScale = parts.length < 2 ? 0 : parts[1].length;
    const adjustmentPowerOf10 = 10 ** adjustmentScale;
    const isAdjustmentSafe = Number(value) * adjustmentPowerOf10 <= Number.MAX_SAFE_INTEGER;
    const powerOf10 = 10 ** maxScale;
    if (adjustmentScale > maxScale && isAdjustmentSafe) {
        const diffPowerOf10 = 10 ** (adjustmentScale - maxScale);
        return Math[algorithm]((value * adjustmentPowerOf10) / diffPowerOf10) / powerOf10;
    } else {
        return Math[algorithm](value * powerOf10) / powerOf10;
    }
}

function roundingToString(value: number, algorithm: "round" | "ceil" | "floor", scale: number): string {
    if (!Number.isInteger(scale) || scale < 0 || scale > 10) {
        throw new Error("[util] NumberUtil.roundingToString scale must be an integer in range [0, 10]");
    }
    return rounding(value, algorithm, scale).toFixed(scale);
}

export const NumberUtil = Object.freeze({
    clamp,
    max,
    min,
    formatWithComma,
    rounding,
    roundingToString,
});
