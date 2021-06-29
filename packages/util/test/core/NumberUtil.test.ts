import {NumberUtil} from "../../src/core/NumberUtil";

test("Clamp", () => {
    const t1 = {value: 10, min: 100, max: 200};
    expect(NumberUtil.clamp(t1.value, t1.min, t1.max)).toBe(t1.min);
    const t2 = {value: 0.3 - 0.2, min: 0.1, max: 200};
    expect(NumberUtil.clamp(t2.value, t2.min, t2.max)).toBe(t2.min);

    const t3 = {value: 1000, min: 100, max: 200};
    expect(NumberUtil.clamp(t3.value, t3.min, t3.max)).toBe(t3.max);
    const t4 = {value: 0.1 + 0.2, min: 0, max: 0.3};
    expect(NumberUtil.clamp(t4.value, t4.min, t4.max)).toBe(t4.max);

    const t5 = {value: 150, min: 100, max: 200};
    expect(NumberUtil.clamp(t5.value, t5.min, t5.max)).toBe(t5.value);
    const t6 = {value: 0.1 + 0.2, min: 0, max: 1};
    expect(NumberUtil.clamp(t6.value, t6.min, t6.max)).toBe(t6.value);

    const dontCare = 0;
    expect(() => NumberUtil.clamp(dontCare, 1000, 0)).toThrow();
    expect(() => NumberUtil.clamp(dontCare, 0, -1000)).toThrow();
    expect(() => NumberUtil.clamp(dontCare, 100, -100)).toThrow();
});

test("Max", () => {
    expect(NumberUtil.max([])).toBe(-Infinity);
    expect(NumberUtil.max([null, undefined])).toBe(-Infinity);

    expect(NumberUtil.max([2])).toBe(2);
    expect(NumberUtil.max([2, 2000.5])).toBe(2000.5);
    expect(NumberUtil.max([2, undefined, 2000.5, null, -2])).toBe(2000.5);
    expect(NumberUtil.max([0, undefined])).toBe(0);
    expect(NumberUtil.max([-1, -1, -1])).toBe(-1);
});

test("Min", () => {
    expect(NumberUtil.min([])).toBe(Infinity);
    expect(NumberUtil.min([null, undefined])).toBe(Infinity);

    expect(NumberUtil.min([2])).toBe(2);
    expect(NumberUtil.min([2, 2000.5])).toBe(2);
    expect(NumberUtil.min([2, undefined, 2000.5, null, -2])).toBe(-2);
    expect(NumberUtil.min([0, undefined])).toBe(0);
    expect(NumberUtil.min([-1, -1, -1])).toBe(-1);
});

test("Format With Comma", () => {
    expect(NumberUtil.formatWithComma(null)).toBe("-");
    expect(NumberUtil.formatWithComma(NaN)).toBe("-");
    expect(NumberUtil.formatWithComma(Infinity)).toBe("-");
    expect(NumberUtil.formatWithComma(0)).toBe("0");

    expect(NumberUtil.formatWithComma(10)).toBe("10");
    expect(NumberUtil.formatWithComma(102)).toBe("102");
    expect(NumberUtil.formatWithComma(1023)).toBe("1,023");
    expect(NumberUtil.formatWithComma(10231)).toBe("10,231");
    expect(NumberUtil.formatWithComma(102312)).toBe("102,312");
    expect(NumberUtil.formatWithComma(-145123)).toBe("-145,123");
    expect(NumberUtil.formatWithComma(-145123.123)).toBe("-145,123.123");
    expect(NumberUtil.formatWithComma(3.0)).toBe("3");
    expect(NumberUtil.formatWithComma(102312.12346)).toBe("102,312.12346");
});

describe("NumberUtil.rounding", () => {
    test("throws if `maxScale` is invalid", () => {
        expect(() => NumberUtil.rounding(10, "round", -1)).toThrow();
        expect(() => NumberUtil.rounding(10, "round", 1.1)).toThrow();
    });

    type TestEachRowSchema = {value: number; algorithm: "round" | "ceil" | "floor"; maxScale: any; expected: number};
    test.each`
        value    | algorithm  | maxScale | expected
        ${3.65}  | ${"floor"} | ${0}     | ${3}
        ${3.65}  | ${"floor"} | ${1}     | ${3.6}
        ${3.65}  | ${"floor"} | ${2}     | ${3.65}
        ${3.65}  | ${"floor"} | ${3}     | ${3.65}
        ${18.58} | ${"floor"} | ${4}     | ${18.58}
        ${7.45}  | ${"ceil"}  | ${0}     | ${8}
        ${7.45}  | ${"ceil"}  | ${1}     | ${7.5}
        ${7.45}  | ${"ceil"}  | ${2}     | ${7.45}
        ${7.45}  | ${"ceil"}  | ${3}     | ${7.45}
        ${18.58} | ${"ceil"}  | ${4}     | ${18.58}
        ${1.664} | ${"round"} | ${0}     | ${2}
        ${1.664} | ${"round"} | ${1}     | ${1.7}
        ${1.664} | ${"round"} | ${2}     | ${1.66}
        ${1.664} | ${"round"} | ${3}     | ${1.664}
        ${1.664} | ${"round"} | ${4}     | ${1.664}
        ${18.58} | ${"round"} | ${4}     | ${18.58}
        ${4.975} | ${"round"} | ${2}     | ${4.98}
    `("rounding($value, '$algorithm', $maxScale) returns $expected", ({value, algorithm, maxScale, expected}: TestEachRowSchema) => {
        expect(NumberUtil.rounding(value, algorithm, maxScale)).toBe(expected);
    });
});

describe("NumberUtil.roundingToString", () => {
    test("throws if `scale` is invalid", () => {
        expect(() => NumberUtil.roundingToString(10, "round", -1)).toThrow();
        expect(() => NumberUtil.roundingToString(10, "round", 1.1)).toThrow();
    });

    type TestEachRowSchema = {value: number; algorithm: "round" | "ceil" | "floor"; scale: any; expected: number};
    test.each`
        value    | algorithm  | scale | expected
        ${3.65}  | ${"floor"} | ${0}  | ${"3"}
        ${3.65}  | ${"floor"} | ${1}  | ${"3.6"}
        ${3.65}  | ${"floor"} | ${2}  | ${"3.65"}
        ${3.65}  | ${"floor"} | ${3}  | ${"3.650"}
        ${7.45}  | ${"ceil"}  | ${0}  | ${"8"}
        ${7.45}  | ${"ceil"}  | ${1}  | ${"7.5"}
        ${7.45}  | ${"ceil"}  | ${2}  | ${"7.45"}
        ${7.45}  | ${"ceil"}  | ${3}  | ${"7.450"}
        ${1.664} | ${"round"} | ${0}  | ${"2"}
        ${1.664} | ${"round"} | ${1}  | ${"1.7"}
        ${1.664} | ${"round"} | ${2}  | ${"1.66"}
        ${1.664} | ${"round"} | ${3}  | ${"1.664"}
        ${1.664} | ${"round"} | ${4}  | ${"1.6640"}
        ${4.975} | ${"round"} | ${2}  | ${"4.98"}
    `("rounding($value, '$algorithm', $scale) returns '$expected'", ({value, algorithm, scale, expected}: TestEachRowSchema) => {
        expect(NumberUtil.roundingToString(value, algorithm, scale)).toBe(expected);
    });
});
