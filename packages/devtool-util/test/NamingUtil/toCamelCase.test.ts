import {NamingUtil} from "../../src/NamingUtil";
import {describe, test, expect} from "vitest";

describe("NamingUtil.toCamelCase", () => {
    type TestEachRowSchema = {input: string; expected: string};
    test.each`
        input            | expected
        ${"test"}        | ${"test"}
        ${"test-test"}   | ${"testTest"}
        ${"test_test"}   | ${"testTest"}
        ${"test0-test"}  | ${"test0Test"}
        ${"test0_test"}  | ${"test0Test"}
        ${"test-test0"}  | ${"testTest0"}
        ${"test_test0"}  | ${"testTest0"}
        ${"test0_test0"} | ${"test0Test0"}
        ${"home-v2"}     | ${"homeV2"}
        ${"home_v2"}     | ${"homeV2"}
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
        ${"0test-test"}
        ${"0test_test"}
        ${"test-0test"}
        ${"test_0test"}
        ${"home-0"}
        ${"home_0"}
    `("toCamelCase('$input') throws error", ({input}: {input: string}) => {
        expect(() => NamingUtil.toCamelCase(input)).toThrowError();
    });
});
