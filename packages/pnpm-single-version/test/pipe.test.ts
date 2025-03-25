import {describe, expect, test} from "vitest";
import {pipe} from "../src/util/pipe.js";

describe("pipe fn unit test", () => {
    test("pipe ", () => {
        expect(
            pipe(
                () => 3,
                _ => _ * 2
            )()
        ).toEqual(6);

        expect(
            pipe(
                () => 3,
                _ => _ + "111",
                _ => _.split("")
            )()
        ).toEqual(["3", "1", "1", "1"]);

        expect(
            pipe(
                () => 3,
                _ => _ + "111",
                _ => _.split(""),
                _ => _.length,
                value => ({value})
            )()
        ).toStrictEqual({value: 4});

        expect(
            pipe(
                // @ts-ignore
                () => "1",
                (_: number) => _ + 3
            )()
        ).toStrictEqual("13");

        expect(
            pipe(
                (_: number) => _ + 1,
                _ => _ + 1,
                _ => _ + 1,
                _ => _ + 1,
                _ => _ + 1,
                _ => _ + 1,
                _ => _.toString()
            )(0)
        ).toEqual("6");

        expect(
            pipe(
                (_: number) => _ + 1,
                _ => _ + 1,
                _ => _ + 1,
                _ => _ + 1,
                _ => _ + 1,
                _ => _ + 1,
                _ => _ + 1,
                _ => _.toString()
            )(0)
        ).toStrictEqual("7");
    });
});
