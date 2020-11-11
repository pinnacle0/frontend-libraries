import glob from "glob";
import path from "path";
import type webpack from "webpack";
import {Plugin} from "./Plugin";

interface StylelintPluginsFactoryOptions {
    projectDirectory: string;
    extraCheckDirectories: string[];
}

export class StylelintPluginsFactory {
    static generate({projectDirectory, extraCheckDirectories}: StylelintPluginsFactoryOptions): webpack.Plugin[] {
        const allCheckableDirectories = [projectDirectory, ...extraCheckDirectories];
        const stylelintPlugins: webpack.Plugin[] = [];

        for (const directory of allCheckableDirectories) {
            const srcDirectory = path.join(directory, "src");
            const containStyleSheet =
                glob.sync("**/*.{css,less}", {
                    cwd: srcDirectory,
                }).length > 0;

            if (containStyleSheet) {
                const plugin = Plugin.styleChecker.stylelint({
                    directory: srcDirectory,
                });
                stylelintPlugins.push(plugin);
            }
        }

        return stylelintPlugins;
    }
}
