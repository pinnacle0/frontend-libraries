// -----------------------------------------------------------------------------
//      Attention: This file is generated by "yarn codegen"
//                           Do not modify by hand
//              Run "yarn codegen" to regenerate this file
// -----------------------------------------------------------------------------

import type * as ESLint from "eslint";

export const jest: ESLint.Linter.Config = {
    plugins: ["jest", "jest-dom", "testing-library"],
    env: {
        jest: true,
    },
    rules: {
        // jest
        "jest/consistent-test-it": ["warn", {fn: "test", withinDescribe: "test"}],
        "jest/expect-expect": "off", // This is too annoying
        "jest/no-alias-methods": ["warn"],
        "jest/no-commented-out-tests": ["warn"],
        "jest/no-deprecated-functions": ["warn"],
        "jest/no-duplicate-hooks": ["warn"],
        "jest/no-export": ["warn"],
        "jest/no-identical-title": ["warn"],
        "jest/no-jasmine-globals": ["warn"],
        "jest/no-mocks-import": ["warn"],
        "jest/no-restricted-matchers": [
            "warn",
            {
                resolves: "Use `expect(await promise)` instead.",
            },
        ],
        "jest/no-standalone-expect": ["warn"],
        "jest/no-test-prefixes": ["warn"],
        "jest/no-test-return-statement": ["warn"],
        "jest/prefer-called-with": ["warn"],
        "jest/prefer-expect-assertions": "off", // This is too annoying
        "jest/prefer-hooks-on-top": ["warn"],
        "jest/prefer-spy-on": ["warn"],
        "jest/prefer-strict-equal": ["warn"],
        "jest/prefer-lowercase-title": ["warn", {ignore: ["describe"]}],
        "jest/prefer-to-be": ["warn"],
        "jest/prefer-to-contain": ["warn"],
        "jest/prefer-to-have-length": ["warn"],
        "jest/prefer-todo": ["warn"],
        "jest/require-top-level-describe": ["warn"],
        "jest/valid-expect": ["warn"],
        "jest/valid-title": "off", // This is too annoying

        // jest-dom
        "jest-dom/prefer-checked": ["warn"],
        "jest-dom/prefer-empty": ["warn"],
        "jest-dom/prefer-enabled-disabled": ["warn"],
        "jest-dom/prefer-focus": ["warn"],
        "jest-dom/prefer-required": ["warn"],
        "jest-dom/prefer-to-have-attribute": ["warn"],
        "jest-dom/prefer-to-have-text-content": ["warn"],

        // testing-library
        "testing-library/await-async-query": ["warn"],
        "testing-library/await-async-utils": ["warn"],
        "testing-library/no-await-sync-query": ["warn"],
        "testing-library/no-dom-import": ["warn", "react"],
        "testing-library/no-render-in-setup": ["warn"],
        "testing-library/prefer-find-by": ["warn"],
        "testing-library/prefer-presence-queries": ["warn"],
        "testing-library/prefer-screen-queries": ["warn"],
        "testing-library/prefer-wait-for": ["warn"],
    },
};
