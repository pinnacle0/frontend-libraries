import {RegExpUtil} from "../../../src/WebpackConfigGenerator/Rule/RegExpUtil.js";
import {describe, test, expect} from "vitest";

describe("RegExpUtil testing", () => {
    test.each`
        notExcludedModule                 | path                                                                   | notExcluded
        ${[]}                             | ${"node_modules"}                                                      | ${false}
        ${[]}                             | ${"node_modules/typescript"}                                           | ${false}
        ${[""]}                           | ${"node_modules/typescript"}                                           | ${false}
        ${["typescript"]}                 | ${"node_modules/typescript/index.js"}                                  | ${true}
        ${["typescript"]}                 | ${"node_modules/typescript"}                                           | ${true}
        ${["typescript", ""]}             | ${"node_modules/typescript/index.js"}                                  | ${true}
        ${["typescript"]}                 | ${"node_modules/other/index.js"}                                       | ${false}
        ${["typescript", "@scoped/pack"]} | ${"node_modules/typescript/index.js"}                                  | ${true}
        ${["typescript", "@scoped/pack"]} | ${"node_modules/other/index.js"}                                       | ${false}
        ${["typescript"]}                 | ${"nested/node_modules/other/index.js"}                                | ${false}
        ${["typescript"]}                 | ${"./src/typescript/index.js"}                                         | ${true}
        ${["@scoped/pack"]}               | ${"node_modules/@scoped/pack/index.js"}                                | ${true}
        ${["@scoped/pack"]}               | ${"node_modules/@sdf13123+12312132/@scoped/pack/index.js"}             | ${true}
        ${["@scoped/pack"]}               | ${"node_modules/@scoped/other/index.js"}                               | ${false}
        ${["typescript", "@scoped/pack"]} | ${"node_modules/@scoped/pack/index.js"}                                | ${true}
        ${["typescript", "@scoped/pack"]} | ${"node_modules/@scoped/other/index.js"}                               | ${false}
        ${["typescript", "@scoped/pack"]} | ${"node_modules/12312_1312312+1123/1231412412/@scoped/other/index.js"} | ${false}
        ${["react"]}                      | ${"node_modules/react-dom/index.js"}                                   | ${false}
        ${["react"]}                      | ${"nested/node_modules/react-dom/index.js"}                            | ${false}
        ${["react-router-dom"]}           | ${"nested/node_modules/react-router-dom/index.js"}                     | ${true}
        ${["react-router-dom"]}           | ${"nested/node_modules/nested/nested/react-router-dom/index.js"}       | ${true}
        ${["react"]}                      | ${"./src/react-dom/index.js"}                                          | ${true}
        ${["react-dom"]}                  | ${"node_modules/react-dom"}                                            | ${true}
        ${["@scoped/core"]}               | ${"/nested-path/ub/node_modules/@scoped/core/udm/bundle.pro.js"}       | ${true}
        ${["@scoped/other"]}              | ${"/nested-path/ub/node_modules/@scoped/core/udm/bundle.pro.js"}       | ${false}
    `("test path $test when RegExpUtil.fileExtension($notExcludedModule)", ({notExcludedModule, path, notExcluded}) => {
        expect(!RegExpUtil.webpackExclude({expect: notExcludedModule}).test(path)).toBe(notExcluded);
    });
});
