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

/**
 * @param userInput Raw text from the input field, may or may not be convertible to `null` or a valid number
 * @param config    Defines the range and scale of a valid number, and if `null` is allowed to be returned
 * @returns         A number that is ensured to be valid and is not `NaN`; or `null` if `allowNull` is true and `userInput` is an empty string; or `"@@INVALID"` if userInput cannot be converted
 */
export const rectifyInputIfValid = (userInput: string, config: {min: number; max: number; scale: number; allowNull: boolean}): null | number | "@@INVALID" => {
    const numOrNan = Number(userInput);
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
