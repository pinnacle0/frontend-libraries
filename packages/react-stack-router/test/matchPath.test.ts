import {matchPathSegment, patternType} from "../src/route/matchPath";
import {describe, test, expect} from "vitest";

describe("match path segment testing", () => {
    test.each`
        path             | expected
        ${":id"}         | ${"parameter"}
        ${":tab(A|B|C)"} | ${"union"}
        ${":tab(|A|||)"} | ${"union"}
        ${":tab(A)"}     | ${"union"}
        ${":**"}         | ${"parameter"}
        ${"*"}           | ${"wildcard"}
        ${"("}           | ${"normal"}
        ${"#sdfsdfdsf"}  | ${"normal"}
        ${"**"}          | ${"fallback"}
        ${"***"}         | ${"normal"}
    `("patternType of $path should be '$expected'", ({path, expected}) => {
        expect(patternType(path)).toBe(expected);
    });

    test.each`
        pattern                   | path         | result                          | throwError
        ${":id"}                  | ${"123"}     | ${{param: {id: "123"}}}         | ${false}
        ${"/:id"}                 | ${"123"}     | ${null}                         | ${false}
        ${":id(123|456)"}         | ${"456"}     | ${{param: {id: "456"}}}         | ${false}
        ${":id(123|456)"}         | ${"bbc"}     | ${null}                         | ${false}
        ${":id(456)"}             | ${"456"}     | ${{param: {id: "456"}}}         | ${false}
        ${":id(456)"}             | ${"123"}     | ${null}                         | ${false}
        ${":id(123_456|456_789)"} | ${"456_789"} | ${{param: {id: "456_789"}}}     | ${false}
        ${":id(123_456|456+789)"} | ${"456+789"} | ${null}                         | ${false}
        ${":id())"}               | ${"456"}     | ${null}                         | ${true}
        ${"*"}                    | ${"456"}     | ${{param: {}, wildcard: "456"}} | ${false}
        ${":*"}                   | ${"abc"}     | ${{param: {"*": "abc"}}}        | ${false}
    `("matchPath($path, $pattern) should be $result", ({path, pattern, result, throwError}) => {
        if (!throwError) {
            expect(matchPathSegment(pattern, path)).toStrictEqual(result);
        } else {
            expect(() => matchPathSegment(pattern, path)).toThrowError();
        }
    });
});
