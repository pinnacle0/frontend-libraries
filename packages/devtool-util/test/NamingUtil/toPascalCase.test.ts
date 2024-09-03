import {NamingUtil} from "../../src/NamingUtil";

describe("NamingUtil.toPascalCase", () => {
    type TestEachRowSchema = {input: string; expected: string};
    test.each`
        input            | expected
        ${"test"}        | ${"Test"}
        ${"test-test"}   | ${"TestTest"}
        ${"test_test"}   | ${"TestTest"}
        ${"test0-test"}  | ${"Test0Test"}
        ${"test0_test"}  | ${"Test0Test"}
        ${"test-test0"}  | ${"TestTest0"}
        ${"test_test0"}  | ${"TestTest0"}
        ${"test0_test0"} | ${"Test0Test0"}
        ${"home-v2"}     | ${"HomeV2"}
        ${"home_v2"}     | ${"HomeV2"}
    `("toPascalCase($input) === $expected", ({input, expected}: TestEachRowSchema) => {
        expect(NamingUtil.toPascalCase(input)).toBe(expected);
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
    `("toPascalCase('$input') throws error", ({input}: {input: string}) => {
        expect(() => NamingUtil.toPascalCase(input)).toThrowError();
    });
});
