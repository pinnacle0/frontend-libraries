import {NumberUtil} from "../../src/internal/NumberUtil.js";
import {describe, test, expect} from "vitest";

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
        ${7.45}  | ${"ceil"}  | ${0}     | ${8}
        ${7.45}  | ${"ceil"}  | ${1}     | ${7.5}
        ${7.45}  | ${"ceil"}  | ${2}     | ${7.45}
        ${7.45}  | ${"ceil"}  | ${3}     | ${7.45}
        ${1.664} | ${"round"} | ${0}     | ${2}
        ${1.664} | ${"round"} | ${1}     | ${1.7}
        ${1.664} | ${"round"} | ${2}     | ${1.66}
        ${1.664} | ${"round"} | ${3}     | ${1.664}
        ${1.664} | ${"round"} | ${4}     | ${1.664}
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
