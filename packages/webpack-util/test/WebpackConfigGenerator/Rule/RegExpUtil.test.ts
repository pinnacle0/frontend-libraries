import {RegExpUtil} from ".../../../src/WebpackConfigGenerator/Rule/RegExpUtil";

describe("RegExpUtil testing", () => {
    test.each`
        notExcludedModule                 | path                                      | notExcluded
        ${[]}                             | ${"node_modules"}                         | ${false}
        ${[]}                             | ${"node_modules/typescript"}              | ${false}
        ${[""]}                           | ${"node_modules/typescript"}              | ${false}
        ${["typescript"]}                 | ${"node_modules/typescript"}              | ${true}
        ${["typescript", ""]}             | ${"node_modules/typescript"}              | ${true}
        ${["typescript"]}                 | ${"node_modules/other"}                   | ${false}
        ${["typescript", "@scoped/pack"]} | ${"node_modules/typescript"}              | ${true}
        ${["typescript", "@scoped/pack"]} | ${"node_modules/other"}                   | ${false}
        ${["typescript"]}                 | ${"nested/node_modules/other"}            | ${false}
        ${["typescript"]}                 | ${"./src/typescript"}                     | ${true}
        ${["@scoped/pack"]}               | ${"node_modules/@scoped/pack"}            | ${true}
        ${["@scoped/pack"]}               | ${"node_modules/@scoped/other"}           | ${false}
        ${["typescript", "@scoped/pack"]} | ${"node_modules/@scoped/pack"}            | ${true}
        ${["typescript", "@scoped/pack"]} | ${"node_modules/@scoped/other"}           | ${false}
        ${["react"]}                      | ${"node_modules/react-dom"}               | ${false}
        ${["react"]}                      | ${"nested/node_modules/react-dom"}        | ${false}
        ${["react-router-dom"]}           | ${"nested/node_modules/react-router-dom"} | ${true}
        ${["react"]}                      | ${"./src/react-dom"}                      | ${true}
    `("test path $test when RegExpUtil.fileExtension($notExcludedModule)", ({notExcludedModule, path, notExcluded}) => {
        expect(!RegExpUtil.webpackNotExclude(notExcludedModule).test(path)).toBe(notExcluded);
    });
});
