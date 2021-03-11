import {NamingUtil} from "../../src/NamingUtil";

describe("NamingUtil.toCamelCase", () => {
    type TestEachRowSchema = {input: string; expected: string};
    test.each`
        input          | expected
        ${"test"}      | ${"test"}
        ${"test-test"} | ${"testTest"}
        ${"test_test"} | ${"testTest"}
    `("toCamelCase($input) === $expected", ({input, expected}: TestEachRowSchema) => {
        expect(NamingUtil.toCamelCase(input)).toBe(expected);
    });

    test.each`
        input
        ${"Test"}
        ${"Test-test"}
        ${"TEST"}
        ${"TEST-TEST"}
        ${"TEST_TEST"}
    `("toCamelCase('$input') throws error", ({input}: {input: string}) => {
        expect(() => NamingUtil.toCamelCase(input)).toThrowError();
    });
});
