import type webpack from "webpack";
import {Utility} from "../Utility";
import {TsLoader} from "./loader-typedef/ts-loader";

interface Deps {
    tsconfigFilepath: string;
}

export function tsRule({tsconfigFilepath}: Deps): webpack.RuleSetRule {
    const tsLoader: TsLoader = {
        loader: require.resolve("ts-loader") as "ts-loader",
        options: {
            configFile: tsconfigFilepath,
        },
    };

    return {
        test: Utility.regExpForFileExtension(".ts", ".tsx"),
        use: [tsLoader],
    };
}
