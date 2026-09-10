export const truncate = (value: number, scale: number): number => {
    return parseFloat(value.toFixed(scale));
};

export const clamp = (_: {value: number; min: number; max: number}): number => {
    return Math.max(_.min, Math.min(_.max, _.value));
};

export const canAdd = (_: {value: number | null; step: number; max: number; scale: number}): boolean => {
    if (_.value === null) {
        return true;
    } else {
        const nextStep = truncate(_.value + _.step, _.scale);
        return nextStep <= truncate(_.max, _.scale);
    }
};

export const canMinus = (_: {value: number | null; step: number; min: number; scale: number}): boolean => {
    if (_.value === null) {
        return true;
    } else {
        const prevStep = truncate(_.value - _.step, _.scale);
        return prevStep >= truncate(_.min, _.scale);
    }
};

export const getDisplayValue = (_: {value: number | null; scale: number; displayRenderer?: (value: number) => string}): string => {
    if (_.value === null) {
        return "";
    } else if (_.displayRenderer) {
        return _.displayRenderer(truncate(_.value, _.scale));
    } else {
        return truncate(_.value, _.scale).toFixed(_.scale);
    }
};

/** A plain decimal number, i.e. what has to be left over once the separators are gone. */
const NUMERIC_PATTERN = /^[+-]?\d+(\.\d*)?$/;

/**
 * Drops `,` and ` ` from `userInput` so that a pasted `"1,000"` / `"1, 000"` / `"1 000 000"` is read as a number.
 *
 * Grouping is **not** validated -- this is a plain number input, so `"1,00"` is read as `100` rather than rejected.
 * Two properties are load-bearing, though:
 * - Only the literal `,` and ` ` are dropped, **not** `\s`, so a tab-delimited paste out of Excel (`"100\t200"`, two
 *   cells) stays invalid instead of merging into `100200`.
 * - `userInput` is returned verbatim unless stripping leaves a plain number, which is what keeps `","` invalid rather
 *   than collapsing to `""` and being read as `null`. It also leaves `".5"` / `"1e3"` to `Number()`, exactly as before.
 */
export const stripThousandSeparators = (userInput: string): string => {
    const strippedInput = userInput.trim().replace(/[, ]/g, "");
    return NUMERIC_PATTERN.test(strippedInput) ? strippedInput : userInput;
};

/**
 * @param userInput Raw text from the input field, may or may not be convertible to `null` or a valid number.
 *                  Comma/space thousand separators are accepted, e.g. `"1,000,000.50"` or `"1 000"`.
 * @param config    Defines the range and scale of a valid number, and if `null` is allowed to be returned
 * @returns         A number that is ensured to be valid and is not `NaN`; or `null` if `allowNull` is true and `userInput` is an empty string; or `"@@INVALID"` if userInput cannot be converted
 */
export const rectifyInputIfValid = (userInput: string, config: {min: number; max: number; scale: number; allowNull: boolean}): null | number | "@@INVALID" => {
    const numOrNan = Number(stripThousandSeparators(userInput));
    if (userInput === "") {
        return config.allowNull ? null : "@@INVALID";
    } else if (isNaN(numOrNan)) {
        return "@@INVALID";
    } else {
        return clamp({
            value: truncate(numOrNan, config.scale),
            min: config.min,
            max: config.max,
        });
    }
};
