import {describe, expect, test} from "vitest";
import {globUtil} from "../src/util/glob-util.js";

describe("globUtil testing", () => {
    test("isMatched", () => {
        expect(globUtil.isMatch("eslint-plugin-import", ["react", "eslint-plugin-*"])).toBeTruthy();
        expect(globUtil.isMatch("eslint-plugin-import", ["react", "eslint-plugin-+(import|game)"])).toBeTruthy();
        expect(globUtil.isMatch("eslint-plugin-import", ["react", "eslint-plugin-!(import|game)"])).toBeFalsy();
        expect(globUtil.isMatch("@babel/core", ["@babel/*"])).toBeTruthy();
        expect(globUtil.isMatch("@babel/core", ["!@babel/*"])).toBeFalsy();

        expect(globUtil.isMatch("react", ["react", "!react"])).toBeTruthy();
        expect(globUtil.isMatch("react", ["!(react)", "react"])).toBeTruthy();
        expect(globUtil.isMatch("react", ["re*/"])).toBeFalsy();

        expect(globUtil.isMatch("@babel/core", ["@@@@@/*"])).toBeFalsy();
        expect(globUtil.isMatch("@babel/core", ["@+&^1.)13##$$/*"])).toBeFalsy();
    });

    test("toRegex", () => {
        expect(globUtil.toRegex(["react", "eslint-plugin-*"]).test("react")).toBeTruthy();
        expect(globUtil.toRegex(["react", "eslint-plugin-*"]).test("eslint-plugin-imports")).toBeTruthy();
        expect(globUtil.toRegex(["react", "eslint-plugin-*"]).test("abc")).toBeFalsy();
        expect(globUtil.toRegex(["react", "eslint-plugin-+(import|game)"]).test("eslint-plugin-import")).toBeTruthy();
        expect(globUtil.toRegex(["react", "eslint-plugin-!(import|game)"]).test("eslint-plugin-import")).toBeFalsy();
        expect(globUtil.toRegex(["@babel/*"]).test("@babel/core")).toBeTruthy();
        expect(globUtil.toRegex(["!@babel/*"]).test("@babel/core")).toBeFalsy();
        expect(globUtil.toRegex(["@(nx)"]).test("@nx/nx")).toBeFalsy();

        expect(globUtil.toRegex(["react", "!react"]).test("react")).toBeTruthy();
        expect(globUtil.toRegex(["!(react)", "react"]).test("react")).toBeTruthy();
        expect(globUtil.toRegex(["re*/"]).test("re")).toBeFalsy();
    });
});
