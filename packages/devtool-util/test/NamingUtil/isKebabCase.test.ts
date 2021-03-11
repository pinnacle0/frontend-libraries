import {NamingUtil} from "../../src/NamingUtil";

describe("NamingUtil.isKebabCase", () => {
    type TestEachRowSchema = {input: string; expected: string};
    test.each`
        input          | expected
        ${"test"}      | ${true}
        ${"test-test"} | ${true}
        ${"test_test"} | ${false}
        ${"Test"}      | ${false}
        ${"Test-test"} | ${false}
        ${"TEST"}      | ${false}
        ${"TEST-TEST"} | ${false}
        ${"TEST_TEST"} | ${false}
    `("isKebabCase('$input') === $expected", ({input, expected}: TestEachRowSchema) => {
        expect(NamingUtil.isKebabCase(input)).toBe(expected);
    });
});
