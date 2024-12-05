import {TextUtil} from "../../src/internal/TextUtil";
import {describe, test, expect} from "vitest";

describe("TextUtil.interpolate", () => {
    test("interpolates values", () => {
        expect(TextUtil.interpolate("{1} {2}", "hello", "world")).toBe("hello world");
        expect(TextUtil.interpolate("{2} {3} {1}", "jest", "This", "is")).toBe("This is jest");
        expect(TextUtil.interpolate("{3} {2} {1}", "a", "b", "c")).toBe("c b a");
        expect(TextUtil.interpolate("{3} {2} {1}", "a", "b", "c", "d")).toBe("c b a");
    });
});
