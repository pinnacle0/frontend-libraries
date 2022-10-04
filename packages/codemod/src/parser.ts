import {parse as babelParse} from "@babel/parser";
import type {Parser} from "jscodeshift";

export const parser: Parser = {
    parse(source: string) {
        return babelParse(source, {
            sourceType: "module",
            plugins: ["jsx", "typescript", "decorators-legacy"],
        });
    },
};
