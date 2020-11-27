import webpack from "webpack";
import type {EntryDescriptor} from "../type";
import {Plugin} from "./Plugin";

interface HtmlWebpackPluginsFactoryOptions {
    configEntryDescriptors: EntryDescriptor[];
}

// TODO: rename to HTMLWebpackPluginsFactory (more than once, pls rename ALL)
export class HtmlWebpackPluginsFactory {
    static generate({configEntryDescriptors}: HtmlWebpackPluginsFactoryOptions): webpack.Plugin[] {
        const htmlPlugins: webpack.Plugin[] = [];

        for (const {name, entryPath, htmlPath} of configEntryDescriptors) {
            if (htmlPath !== undefined) {
                const plugin = Plugin.fileOutput.html({
                    entry: {name, entryPath, htmlPath},
                });
                htmlPlugins.push(plugin);
            }
        }

        return htmlPlugins;
    }
}
