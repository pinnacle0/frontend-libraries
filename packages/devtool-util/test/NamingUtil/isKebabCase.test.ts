import {NamingUtil} from "../../src/NamingUtil.js";
import {describe, test, expect} from "vitest";

describe("NamingUtil.isKebabCase", () => {
    type TestEachRowSchema = {input: string; expected: string};
    test.each`
        input            | expected
        ${"test"}        | ${true}
        ${"test-test"}   | ${true}
        ${"test0-test"}  | ${true}
        ${"test-test0"}  | ${true}
        ${"test0-test0"} | ${true}
        ${"home-v2"}     | ${true}
        ${"test_test"}   | ${false}
        ${"Test"}        | ${false}
        ${"Test-test"}   | ${false}
        ${"TEST"}        | ${false}
        ${"TEST-TEST"}   | ${false}
        ${"TEST_TEST"}   | ${false}
        ${"0test-test"}  | ${false}
        ${"test-0test"}  | ${false}
        ${"home-0"}      | ${false}
    `("isKebabCase('$input') === $expected", ({input, expected}: TestEachRowSchema) => {
        expect(NamingUtil.isKebabCase(input)).toBe(expected);
    });
});
