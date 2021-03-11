import {NamingUtil} from "../../src/NamingUtil";

describe("NamingUtil.isSnakeCase", () => {
    type TestEachRowSchema = {input: string; expected: string};
    test.each`
        input          | expected
        ${"test"}      | ${true}
        ${"test-test"} | ${false}
        ${"test_test"} | ${true}
        ${"Test"}      | ${false}
        ${"Test-test"} | ${false}
        ${"TEST"}      | ${false}
        ${"TEST-TEST"} | ${false}
        ${"TEST_TEST"} | ${false}
    `("isSnakeCase('$input') === $expected", ({input, expected}: TestEachRowSchema) => {
        expect(NamingUtil.isSnakeCase(input)).toBe(expected);
    });
});
