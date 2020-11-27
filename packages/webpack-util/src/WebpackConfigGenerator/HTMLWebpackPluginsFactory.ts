import webpack from "webpack";
import type {EntryDescriptor} from "../type";
import {Plugin} from "./Plugin";

interface HTMLWebpackPluginsFactoryOptions {
    configEntryDescriptors: EntryDescriptor[];
}

export class HTMLWebpackPluginsFactory {
    static generate({configEntryDescriptors}: HTMLWebpackPluginsFactoryOptions): webpack.Plugin[] {
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
