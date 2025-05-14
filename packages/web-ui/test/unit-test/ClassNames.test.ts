import {classNames} from "../../src/util/ClassNames/index.js";
import {describe, test, expect} from "vitest";

describe("classNames testing", () => {
    test("basic usage", () => {
        let extraClass: string | boolean | undefined = undefined;
        expect(classNames("game-class", {extraClass})).toBe("game-class");

        extraClass = "extra-class-with-longer-name";
        expect(classNames("game-class", {extraClass})).toBe("game-class extraClass");
        expect(classNames("game-class", extraClass)).toBe("game-class extra-class-with-longer-name");
        expect(classNames("game-class", {[extraClass]: extraClass})).toBe("game-class extra-class-with-longer-name");
        expect(classNames("game-class", extraClass ? "short-class-name" : extraClass)).toBe("game-class short-class-name");

        extraClass = true;
        expect(classNames("game-class", {extraClass})).toBe("game-class extraClass");
    });
});
