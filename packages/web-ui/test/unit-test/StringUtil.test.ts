import {StringUtil} from "@pinnacle0/web-ui/internal/StringUtil";

describe("StringUtil.numberToFloorFixed", () => {
    test("floors number with scale", () => {
        expect(() => StringUtil.numberToFloorFixed(3.5, 1.1)).toThrow();
        expect(() => StringUtil.numberToFloorFixed(3.5, -2)).toThrow();

        expect(StringUtil.numberToFloorFixed(NaN, 2)).toBe("-");
        expect(StringUtil.numberToFloorFixed(Infinity, 2)).toBe("-");

        expect(StringUtil.numberToFloorFixed(3.236, 2)).toBe("3.23");
        expect(StringUtil.numberToFloorFixed(-3.236, 2)).toBe("-3.23");
        expect(StringUtil.numberToFloorFixed(4324233.236, 1)).toBe("4324233.2");
        expect(StringUtil.numberToFloorFixed(4324233.236, 0)).toBe("4324233");

        expect(StringUtil.numberToFloorFixed(0, 0)).toBe("0");
        expect(StringUtil.numberToFloorFixed(0, 1)).toBe("0.0");
        expect(StringUtil.numberToFloorFixed(0, 2)).toBe("0.00");

        expect(StringUtil.numberToFloorFixed(43.299, 0)).toBe("43");
        expect(StringUtil.numberToFloorFixed(43.299, 1)).toBe("43.2");
        expect(StringUtil.numberToFloorFixed(43.299, 2)).toBe("43.29");
        expect(StringUtil.numberToFloorFixed(43.299, 3)).toBe("43.299");
        expect(StringUtil.numberToFloorFixed(43.299, 4)).toBe("43.2990");
    });
});

describe("StringUtil.interpolate", () => {
    test("interpolates values", () => {
        expect(StringUtil.interpolate("{1} {2}", "hello", "world")).toBe("hello world");
        expect(StringUtil.interpolate("{2} {3} {1}", "jest", "This", "is")).toBe("This is jest");
        expect(StringUtil.interpolate("{3} {2} {1}", "a", "b", "c")).toBe("c b a");
        expect(StringUtil.interpolate("{3} {2} {1}", "a", "b", "c", "d")).toBe("c b a");
    });
});
