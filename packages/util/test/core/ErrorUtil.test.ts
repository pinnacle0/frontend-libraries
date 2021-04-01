import {ErrorUtil} from "../../src/core/ErrorUtil";

describe("ErrorUtil.serialize", () => {
    test("Empty cases", () => {
        expect(ErrorUtil.serialize("")).toBe(`""`);
        expect(ErrorUtil.serialize(0)).toBe(`0`);
        expect(ErrorUtil.serialize([])).toBe(`[]`);
        expect(ErrorUtil.serialize(NaN)).toBe("[Empty]");
        expect(ErrorUtil.serialize(undefined)).toBe(`[Empty]`);
        expect(ErrorUtil.serialize(null)).toBe(`[Empty]`);
    });

    test("Check error message exist", () => {
        const errorMessage = "fooooo@@";
        const rangeError = new RangeError(errorMessage);
        expect(JSON.stringify(rangeError).includes(errorMessage)).toBeFalsy();
        expect(ErrorUtil.serialize(rangeError).includes(errorMessage)).toBeTruthy();
    });
});
