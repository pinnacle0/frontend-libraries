import path from "path";
import type webpack from "webpack";
import {Plugin} from "./Plugin";

interface ForkTsCheckerPluginsFactoryOptions {
    projectDirectory: string;
    extraCheckDirectories: string[];
}

export class ForkTsCheckerPluginsFactory {
    static generate({projectDirectory, extraCheckDirectories}: ForkTsCheckerPluginsFactoryOptions): webpack.Plugin[] {
        const allCheckableDirectories = [projectDirectory, ...extraCheckDirectories];
        const forkTsCheckerPlugins: webpack.Plugin[] = [];

        for (const directory of allCheckableDirectories) {
            const srcDirectory = path.join(directory, "src");
            const tsconfigFilepath = path.join(directory, "tsconfig.json");

            const plugin = Plugin.styleChecker.forkTsChecker({
                projectSrcDirectory: srcDirectory,
                tsconfigFilepath,
            });
            forkTsCheckerPlugins.push(plugin);
        }

        return forkTsCheckerPlugins;
    }
}
