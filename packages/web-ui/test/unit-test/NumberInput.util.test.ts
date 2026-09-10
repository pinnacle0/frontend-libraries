import {canAdd, canMinus, clamp, getDisplayValue, rectifyInputIfValid, stripThousandSeparators, truncate} from "../../src/core/NumberInput/util.js";
import {describe, test, expect, vi} from "vitest";

describe("truncate", () => {
    const sum = 0.1 + 0.2;
    const difference = 0.3 - 0.2;

    test("sum and difference fixture has unwanted decimal points", () => {
        expect(sum.toString()).not.toBe("0.3"); // This should be something like "0.30000000000000004"
        expect(/\.[0-9]{1}$/.test(sum.toString())).toBe(false);

        expect(difference.toString()).not.toBe("0.1"); // This should be something like "0.09999999999999998"
        expect(/\.[0-9]{1}$/.test(difference.toString())).toBe(false);
    });

    test("returns correct number of decimal points after calling truncate()", () => {
        expect(truncate(sum, 1).toString()).toBe("0.3");
        expect(truncate(sum, 4).toString()).toBe("0.3");

        expect(truncate(difference, 1).toString()).toBe("0.1");
        expect(truncate(difference, 4).toString()).toBe("0.1");
    });
});

describe("clamp", () => {
    type Params = Parameters<typeof clamp>[0];

    test("returns min if outside range(min)", () => {
        const test1: Params = {value: 10, min: 100, max: 200};
        expect(clamp(test1)).toBe(test1.min);
        const test2: Params = {value: 0.3 - 0.2, min: 0.1, max: 200};
        expect(clamp(test2)).toBe(test2.min);
    });

    test("returns max if outside range(max)", () => {
        const test1: Params = {value: 1000, min: 100, max: 200};
        expect(clamp(test1)).toBe(test1.max);
        const test2: Params = {value: 0.1 + 0.2, min: 0, max: 0.3};
        expect(clamp(test2)).toBe(test2.max);
    });

    test("returns original value if within range", () => {
        const test1: Params = {value: 150, min: 100, max: 200};
        expect(clamp(test1)).toBe(test1.value);
        const test2: Params = {value: 0.1 + 0.2, min: 0, max: 1};
        expect(clamp(test2)).toBe(test2.value);
        expect(/[0-9]\.[0-9]/.test(clamp(test2).toString())).toBe(true);
    });
});

describe("canAdd", () => {
    type Params = Parameters<typeof canAdd>[0];

    test("allows add if value is null (no value provided)", () => {
        const props: Params = {
            value: null,
            step: null as unknown as number, // don't care
            max: null as unknown as number, // don't care
            scale: null as unknown as number, // don't care
        };
        expect(canAdd(props)).toBe(true);
    });

    test("allows add if next value inside range(max)", () => {
        const integerProps: Params = {
            value: 9,
            step: 1,
            max: 10,
            scale: 0,
        };
        expect(canAdd(integerProps)).toBe(true);

        const floatProps: Params = {
            value: 0.2,
            step: 0.1,
            max: 0.3,
            scale: 1,
        };
        expect(canAdd(floatProps)).toBe(true);
    });

    test("disallows add if next value outside range(max)", () => {
        const integerProps: Params = {
            value: 9,
            step: 3,
            max: 10,
            scale: 0,
        };
        expect(canAdd(integerProps)).toBe(false);

        const floatProps: Params = {
            value: 0.2,
            step: 0.2,
            max: 0.3,
            scale: 1,
        };
        expect(canAdd(floatProps)).toBe(false);
    });
});

describe("canMinus", () => {
    type Params = Parameters<typeof canMinus>[0];

    test("allows minus if value is null (no value provided)", () => {
        const props: Params = {
            value: null,
            step: null as unknown as number, // don't care
            min: null as unknown as number, // don't care
            scale: null as unknown as number, // don't care
        };
        expect(canMinus(props)).toBe(true);
    });

    test("allows minus if prev value inside range(min)", () => {
        const integerProps: Params = {
            value: 1,
            step: 1,
            min: 0,
            scale: 0,
        };
        expect(canMinus(integerProps)).toBe(true);

        const floatProps: Params = {
            value: 0.3,
            step: 0.2,
            min: 0.1,
            scale: 1,
        };
        expect(canMinus(floatProps)).toBe(true);
    });

    test("disallows minus if prev value outside range(min)", () => {
        const integerProps: Params = {
            value: 15,
            step: 10,
            min: 10,
            scale: 0,
        };
        expect(canMinus(integerProps)).toBe(false);

        const floatProps: Params = {
            value: 0.2,
            step: 0.4,
            min: 0,
            scale: 1,
        };
        expect(canMinus(floatProps)).toBe(false);
    });
});

describe("getDisplayValue", () => {
    test("**always** shows empty string if value is null (no value provided)", () => {
        const displayValue1 = getDisplayValue({
            value: null,
            scale: null as unknown as number, // don't care
        });
        expect(displayValue1).toBe("");

        const displayRenderer = vi.fn();
        const displayValue2 = getDisplayValue({
            value: null,
            scale: null as unknown as number, // don't care
            displayRenderer,
        });
        expect(displayValue2).toBe("");
        expect(displayRenderer).not.toHaveBeenCalled();
    });

    test("uses custom display renderer if provided", () => {
        const displayRenderer = vi.fn().mockReturnValue("CUSTOM DISPLAY VALUE");
        const displayValue = getDisplayValue({
            value: 1,
            scale: 1,
            displayRenderer,
        });
        expect(displayValue).toBe("CUSTOM DISPLAY VALUE");
        expect(displayRenderer).toHaveBeenCalledTimes(1);
    });

    test("display the truncated value with `scale` number of decimal points when no custom display renderer", () => {
        const displayValue1 = getDisplayValue({
            value: 0.3,
            scale: 4,
        });
        expect(displayValue1).toBe("0.3000");

        const displayValue2 = getDisplayValue({
            value: 0.1 + 0.2, // This should be something like 0.30000000000000004
            scale: 4,
        });
        expect(displayValue2).toBe("0.3000");
    });
});

describe("stripThousandSeparators", () => {
    test("drops the separators when what remains is a plain number", () => {
        expect.assertions(15);
        const createTest = (_: {inputText: string; expectedText: string}) => ({
            run: () => expect(stripThousandSeparators(_.inputText)).toBe(_.expectedText),
        });
        createTest({inputText: "1,000", expectedText: "1000"}).run();
        createTest({inputText: "1, 000", expectedText: "1000"}).run();
        createTest({inputText: "1 000", expectedText: "1000"}).run();
        createTest({inputText: "1,000,000", expectedText: "1000000"}).run();
        createTest({inputText: "1, 000, 000", expectedText: "1000000"}).run();
        createTest({inputText: "1 000 000", expectedText: "1000000"}).run();
        createTest({inputText: "1,000.50", expectedText: "1000.50"}).run();
        createTest({inputText: "-1,000", expectedText: "-1000"}).run();
        createTest({inputText: "+1,000", expectedText: "+1000"}).run();
        createTest({inputText: " 1,000 ", expectedText: "1000"}).run(); // pasted from a spreadsheet or a web page
        createTest({inputText: "\t1, 000\n", expectedText: "1000"}).run();
        // Grouping is deliberately not validated: this is a plain number input, so a mis-grouped separator is read rather than rejected
        createTest({inputText: "1,00", expectedText: "100"}).run();
        createTest({inputText: "12,34,567", expectedText: "1234567"}).run();
        createTest({inputText: "1,,000", expectedText: "1000"}).run();
        createTest({inputText: "1,", expectedText: "1"}).run(); // a half-typed number keeps its value instead of going invalid
    });

    test("returns the userInput verbatim when stripping would not leave a plain number", () => {
        expect.assertions(7);
        const createTest = (_: {inputText: string}) => ({
            run: () => expect(stripThousandSeparators(_.inputText)).toBe(_.inputText),
        });
        createTest({inputText: ","}).run(); // must NOT collapse to "", which `rectifyInputIfValid` would read as `null`
        createTest({inputText: "."}).run();
        createTest({inputText: "1.0f"}).run();
        createTest({inputText: "1000"}).run(); // no separators, nothing to strip
        createTest({inputText: "100\t200"}).run(); // two spreadsheet cells must not merge into 100200
        createTest({inputText: "1e3"}).run(); // left for `Number()` to handle, exactly as before
        createTest({inputText: ".5"}).run();
    });
});

describe("makeBestEffortToConvertEditingValueToValidNumber", () => {
    type Config = Parameters<typeof rectifyInputIfValid>[1];

    test("returns the userInput as a number (integer config)", () => {
        expect.assertions(6);
        const allowNullGetterSpy = vi.fn();
        const config: Config = {
            min: 1,
            max: 10,
            scale: 0,
            get allowNull() {
                return allowNullGetterSpy();
            },
        };
        const createTest = (_: {inputText: string; expectedIntegerValue: number}) => ({
            run: () => expect(rectifyInputIfValid(_.inputText, config)).toBe(_.expectedIntegerValue),
        });
        createTest({inputText: "1", expectedIntegerValue: 1}).run();
        createTest({inputText: "1.0", expectedIntegerValue: 1}).run();
        createTest({inputText: "2", expectedIntegerValue: 2}).run();
        createTest({inputText: "10", expectedIntegerValue: 10}).run();
        createTest({inputText: "10.0", expectedIntegerValue: 10}).run();
        expect(allowNullGetterSpy).not.toHaveBeenCalled();
    });

    test("returns the userInput as a number (float 2 decimal point config)", () => {
        expect.assertions(6);
        const allowNullGetterSpy = vi.fn();
        const config: Config = {
            min: 0,
            max: 1,
            scale: 2,
            get allowNull() {
                return allowNullGetterSpy();
            },
        };
        const createTest = (_: {inputText: string; expectedFloatValue: number}) => ({
            run: () => expect(rectifyInputIfValid(_.inputText, config)).toBe(_.expectedFloatValue),
        });
        createTest({inputText: "0", expectedFloatValue: 0}).run();
        createTest({inputText: "0.0", expectedFloatValue: 0}).run();
        createTest({inputText: "0.25", expectedFloatValue: 0.25}).run();
        createTest({inputText: "1", expectedFloatValue: 1}).run();
        createTest({inputText: "1.000", expectedFloatValue: 1}).run();
        expect(allowNullGetterSpy).not.toHaveBeenCalled();
    });

    test("converts the userInput to a valid number (integer config)", () => {
        expect.assertions(8);
        const allowNullGetterSpy = vi.fn();
        const config: Config = {
            min: 1,
            max: 10,
            scale: 0,
            get allowNull() {
                return allowNullGetterSpy();
            },
        };
        const createTest = (_: {convertibleText: string; expectedIntegerValue: number}) => ({
            run: () => expect(rectifyInputIfValid(_.convertibleText, config)).toBe(_.expectedIntegerValue),
        });
        createTest({convertibleText: "0", expectedIntegerValue: 1}).run();
        createTest({convertibleText: "0.1", expectedIntegerValue: 1}).run();
        createTest({convertibleText: "1.000000001", expectedIntegerValue: 1}).run();
        createTest({convertibleText: "4.4", expectedIntegerValue: 4}).run();
        createTest({convertibleText: "4.9", expectedIntegerValue: 5}).run();
        createTest({convertibleText: "9.999999999", expectedIntegerValue: 10}).run();
        createTest({convertibleText: "10.4", expectedIntegerValue: 10}).run();
        expect(allowNullGetterSpy).not.toHaveBeenCalled();
    });

    test("converts the userInput to a valid number (float 4 decimal point config)", () => {
        expect.assertions(8);
        const allowNullGetterSpy = vi.fn();
        const config: Config = {
            min: 0,
            max: 1,
            scale: 4,
            get allowNull() {
                return allowNullGetterSpy();
            },
        };
        const createTest = (_: {convertibleText: string; expectedFloatValue: number}) => ({
            run: () => expect(rectifyInputIfValid(_.convertibleText, config)).toBe(_.expectedFloatValue),
        });
        createTest({convertibleText: "0.000000000001", expectedFloatValue: 0}).run();
        createTest({convertibleText: "0.0101", expectedFloatValue: 0.0101}).run();
        createTest({convertibleText: "0.30000000000000004", expectedFloatValue: 0.3}).run();
        createTest({convertibleText: "0.40999999999999999", expectedFloatValue: 0.41}).run();
        createTest({convertibleText: "0.50069696969696969", expectedFloatValue: 0.5007}).run();
        createTest({convertibleText: "0.50001", expectedFloatValue: 0.5}).run();
        createTest({convertibleText: "1.00000000000000001", expectedFloatValue: 1}).run();
        expect(allowNullGetterSpy).not.toHaveBeenCalled();
    });

    test("accepts thousand separators in the userInput (integer config)", () => {
        expect.assertions(8);
        const allowNullGetterSpy = vi.fn();
        const config: Config = {
            min: 0,
            max: 99_999_999,
            scale: 0,
            get allowNull() {
                return allowNullGetterSpy();
            },
        };
        const createTest = (_: {inputText: string; expectedIntegerValue: number}) => ({
            run: () => expect(rectifyInputIfValid(_.inputText, config)).toBe(_.expectedIntegerValue),
        });
        createTest({inputText: "1,000", expectedIntegerValue: 1000}).run();
        createTest({inputText: "1, 000", expectedIntegerValue: 1000}).run();
        createTest({inputText: "1 000 000", expectedIntegerValue: 1000000}).run();
        createTest({inputText: "12,345,678", expectedIntegerValue: 12345678}).run();
        createTest({inputText: "1,000.4", expectedIntegerValue: 1000}).run();
        createTest({inputText: "999,999,999", expectedIntegerValue: 99999999}).run(); // still clamped to `max`
        createTest({inputText: "1,00", expectedIntegerValue: 100}).run(); // mis-grouped, but read rather than rejected
        expect(allowNullGetterSpy).not.toHaveBeenCalled();
    });

    test("accepts thousand separators in the userInput (float 2 decimal point config)", () => {
        expect.assertions(7);
        const allowNullGetterSpy = vi.fn();
        const config: Config = {
            min: -99_999_999,
            max: 99_999_999,
            scale: 2,
            get allowNull() {
                return allowNullGetterSpy();
            },
        };
        const createTest = (_: {inputText: string; expectedFloatValue: number}) => ({
            run: () => expect(rectifyInputIfValid(_.inputText, config)).toBe(_.expectedFloatValue),
        });
        createTest({inputText: "1,000.50", expectedFloatValue: 1000.5}).run();
        createTest({inputText: "-1,000.25", expectedFloatValue: -1000.25}).run();
        createTest({inputText: "+1,000", expectedFloatValue: 1000}).run();
        createTest({inputText: " 1,000 ", expectedFloatValue: 1000}).run();
        createTest({inputText: "1 000", expectedFloatValue: 1000}).run();
        createTest({inputText: "1,000,000.129", expectedFloatValue: 1000000.13}).run(); // truncated to `scale`
        expect(allowNullGetterSpy).not.toHaveBeenCalled();
    });

    test("returns magic string (invalid) if userInput cannot be converted (integer config)", () => {
        expect.assertions(7);
        const allowNullGetterSpy = vi.fn();
        const config: Config = {
            min: 1,
            max: 10,
            scale: 0,
            get allowNull() {
                return allowNullGetterSpy();
            },
        };
        const createTest = (_: {unconvertibleText: string}) => ({
            run: () => expect(rectifyInputIfValid(_.unconvertibleText, config)).toBe("@@INVALID"),
        });
        createTest({unconvertibleText: ","}).run();
        createTest({unconvertibleText: "."}).run();
        createTest({unconvertibleText: "1.0f"}).run();
        createTest({unconvertibleText: "1.0.0"}).run();
        createTest({unconvertibleText: "REEEEEEEEEEE"}).run();
        createTest({unconvertibleText: "😄"}).run();
        expect(allowNullGetterSpy).not.toHaveBeenCalled();
    });

    test("returns magic string (invalid) if userInput cannot be converted (float 4 decimal point config)", () => {
        expect.assertions(7);
        const allowNullGetterSpy = vi.fn();
        const config: Config = {
            min: 0,
            max: 1,
            scale: 4,
            get allowNull() {
                return allowNullGetterSpy();
            },
        };
        const createTest = (_: {unconvertibleText: string}) => ({
            run: () => expect(rectifyInputIfValid(_.unconvertibleText, config)).toBe("@@INVALID"),
        });
        createTest({unconvertibleText: ","}).run();
        createTest({unconvertibleText: "."}).run();
        createTest({unconvertibleText: "1.0f"}).run();
        createTest({unconvertibleText: "1.0.0"}).run();
        createTest({unconvertibleText: "REEEEEEEEEEE"}).run();
        createTest({unconvertibleText: "😄"}).run();
        expect(allowNullGetterSpy).not.toHaveBeenCalled();
    });

    test("returns null if userInput is empty string when `allowNull` is true", () => {
        const allowNull = true;
        const configPropertyGetterSpy = vi.fn();
        const mockAllowNullGetter = vi.fn().mockReturnValue(allowNull);
        const config = {
            get min() {
                return configPropertyGetterSpy();
            },
            get max() {
                return configPropertyGetterSpy();
            },
            get scale() {
                return configPropertyGetterSpy();
            },
            get allowNull() {
                return mockAllowNullGetter();
            },
        };
        const result = rectifyInputIfValid("", config);
        expect(result).toBeNull();
        expect(mockAllowNullGetter).toHaveBeenCalledWith();
        expect(configPropertyGetterSpy).not.toHaveBeenCalled();
    });

    test("returns magic string (invalid) if userInput is empty string when `allowNull` is false", () => {
        const allowNull = false;
        const configPropertyGetterSpy = vi.fn();
        const mockAllowNullGetter = vi.fn().mockReturnValue(allowNull);
        const config = {
            get min() {
                return configPropertyGetterSpy();
            },
            get max() {
                return configPropertyGetterSpy();
            },
            get scale() {
                return configPropertyGetterSpy();
            },
            get allowNull() {
                return mockAllowNullGetter();
            },
        };
        const result = rectifyInputIfValid("", config);
        expect(result).toBe("@@INVALID");
        expect(mockAllowNullGetter).toHaveBeenCalledWith();
        expect(configPropertyGetterSpy).not.toHaveBeenCalled();
    });
});
