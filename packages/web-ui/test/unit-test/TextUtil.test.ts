import {TextUtil} from "@pinnacle0/web-ui/internal/TextUtil";

describe("TextUtil.interpolate", () => {
    test("interpolates values", () => {
        expect(TextUtil.interpolate("{1} {2}", "hello", "world")).toBe("hello world");
        expect(TextUtil.interpolate("{2} {3} {1}", "jest", "This", "is")).toBe("This is jest");
        expect(TextUtil.interpolate("{3} {2} {1}", "a", "b", "c")).toBe("c b a");
        expect(TextUtil.interpolate("{3} {2} {1}", "a", "b", "c", "d")).toBe("c b a");
    });
});
