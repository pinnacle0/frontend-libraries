import type {Plugins} from "@rspack/core";
import type {EntryDescriptor} from "../type.js";
import {Plugin} from "./Plugin/index.js";

interface HTMLWebpackPluginsFactoryOptions {
    configEntryDescriptors: EntryDescriptor[];
}

export class HTMLWebpackPluginsFactory {
    static generate({configEntryDescriptors}: HTMLWebpackPluginsFactoryOptions): Plugins {
        const htmlPlugins: Plugins = [];

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
