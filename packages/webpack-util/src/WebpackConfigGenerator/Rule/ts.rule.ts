import type webpack from "webpack";
import {Utility} from "../Utility";

interface Deps {
    tsconfigFilepath: string;
}

export function tsRule({tsconfigFilepath}: Deps): webpack.RuleSetRule {
    const tsLoader: webpack.RuleSetLoader = {
        loader: "ts-loader",
        options: {
            configFile: tsconfigFilepath,
            transpileOnly: true,
        },
    };

    return {
        test: Utility.regExpForFileExtension(".ts", ".tsx"),
        use: [tsLoader],
    };
}
