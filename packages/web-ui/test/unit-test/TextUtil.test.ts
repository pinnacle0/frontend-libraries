import {TextUtil} from "@pinnacle0/web-ui/internal/TextUtil";

describe("TextUtil.numberToFloorFixed", () => {
    test("floors number with scale", () => {
        expect(() => TextUtil.numberToFloorFixed(3.5, 1.1)).toThrow();
        expect(() => TextUtil.numberToFloorFixed(3.5, -2)).toThrow();

        expect(TextUtil.numberToFloorFixed(NaN, 2)).toBe("-");
        expect(TextUtil.numberToFloorFixed(Infinity, 2)).toBe("-");

        expect(TextUtil.numberToFloorFixed(3.236, 2)).toBe("3.23");
        expect(TextUtil.numberToFloorFixed(-3.236, 2)).toBe("-3.23");
        expect(TextUtil.numberToFloorFixed(4324233.236, 1)).toBe("4324233.2");
        expect(TextUtil.numberToFloorFixed(4324233.236, 0)).toBe("4324233");

        expect(TextUtil.numberToFloorFixed(0, 0)).toBe("0");
        expect(TextUtil.numberToFloorFixed(0, 1)).toBe("0.0");
        expect(TextUtil.numberToFloorFixed(0, 2)).toBe("0.00");

        expect(TextUtil.numberToFloorFixed(43.299, 0)).toBe("43");
        expect(TextUtil.numberToFloorFixed(43.299, 1)).toBe("43.2");
        expect(TextUtil.numberToFloorFixed(43.299, 2)).toBe("43.29");
        expect(TextUtil.numberToFloorFixed(43.299, 3)).toBe("43.299");
        expect(TextUtil.numberToFloorFixed(43.299, 4)).toBe("43.2990");
    });
});

describe("TextUtil.interpolate", () => {
    test("interpolates values", () => {
        expect(TextUtil.interpolate("{1} {2}", "hello", "world")).toBe("hello world");
        expect(TextUtil.interpolate("{2} {3} {1}", "jest", "This", "is")).toBe("This is jest");
        expect(TextUtil.interpolate("{3} {2} {1}", "a", "b", "c")).toBe("c b a");
        expect(TextUtil.interpolate("{3} {2} {1}", "a", "b", "c", "d")).toBe("c b a");
    });
});
