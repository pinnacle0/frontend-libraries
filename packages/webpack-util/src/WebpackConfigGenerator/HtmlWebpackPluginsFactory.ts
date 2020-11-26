import webpack from "webpack";
import type {ChunkEntry} from "../type";
import {Plugin} from "./Plugin";

interface HtmlWebpackPluginsFactoryOptions {
    configChunkEntries: ChunkEntry[];
}

// TODO: rename to HTMLWebpackPluginsFactory (more than once, pls rename ALL)
export class HtmlWebpackPluginsFactory {
    static generate({configChunkEntries}: HtmlWebpackPluginsFactoryOptions): webpack.Plugin[] {
        const htmlPlugins: webpack.Plugin[] = [];

        for (const {name, chunkEntryPath, htmlPath} of configChunkEntries) {
            if (htmlPath !== undefined) {
                const plugin = Plugin.fileOutput.html({
                    entry: {name, chunkEntryPath, htmlPath},
                });
                htmlPlugins.push(plugin);
            }
        }

        return htmlPlugins;
    }
}
