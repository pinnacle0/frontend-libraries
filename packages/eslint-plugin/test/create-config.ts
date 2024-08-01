import path from "path";
import {type ParserOptions} from "@typescript-eslint/parser";
import {RuleTesterConfig} from "@typescript-eslint/rule-tester";
import {parser} from "typescript-eslint";

export function createConfig(parserOptions: ParserOptions = {}): RuleTesterConfig {
    return {
        languageOptions: {
            parser,
            parserOptions: {
                sourceType: "module",
                ecmaVersion: 2019,
                ecmaFeatures: {
                    jsx: true,
                },
                project: path.join(__dirname, "../config/tsconfig.test.json"),
                tsconfigRootDir: path.join(__dirname, "./fixture"),
                ...parserOptions,
            },
        },
    };
}
