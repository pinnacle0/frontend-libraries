import {NamingUtil} from "../../src/NamingUtil";

describe("NamingUtil.isSnakeCase", () => {
    type TestEachRowSchema = {input: string; expected: string};
    test.each`
        input            | expected
        ${"test"}        | ${true}
        ${"test-test"}   | ${false}
        ${"test_test"}   | ${true}
        ${"test0_test"}  | ${true}
        ${"test_test0"}  | ${true}
        ${"test0_test0"} | ${true}
        ${"home_v2"}     | ${true}
        ${"Test"}        | ${false}
        ${"Test-test"}   | ${false}
        ${"TEST"}        | ${false}
        ${"TEST-TEST"}   | ${false}
        ${"TEST_TEST"}   | ${false}
        ${"0test_test"}  | ${false}
        ${"test_0test"}  | ${false}
        ${"home_0"}      | ${false}
    `("isSnakeCase('$input') === $expected", ({input, expected}: TestEachRowSchema) => {
        expect(NamingUtil.isSnakeCase(input)).toBe(expected);
    });
});
