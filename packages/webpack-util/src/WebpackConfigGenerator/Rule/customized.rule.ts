import type webpack from "webpack";
import type {GeneratorLoader} from "../../type";

interface CustomizedRuleDeps {
    loaders: GeneratorLoader<any>[];
}

/**
 * @see https://webpack.js.org/contribute/writing-a-loader/
 */
export function customizedRule({loaders}: CustomizedRuleDeps): webpack.RuleSetRule[] {
    return loaders.map(({pattern, loaderPath, options}) => ({
        test: pattern,
        use: {
            loader: loaderPath,
            options,
        },
    }));
}
