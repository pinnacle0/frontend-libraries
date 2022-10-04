// @ts-ignore
import {defineTest, defineInlineTest} from "jscodeshift/dist/testUtils";
import path from "path";
import type {ModType} from "../src/modType";

export const createTest = function (type: ModType, prefix: string) {
    defineTest(path.join(__dirname, "test"), `../src/mod/${type}`, null, `${type}/${prefix}`, {parser: "tsx"});
};

export const createInlineTest = function (type: ModType, input: string, output: string, title: string) {
    defineInlineTest(require("../src/mod/" + type), {}, input, output, title);
};
