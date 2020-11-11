import webpack from "webpack";
import {Plugin} from "./Plugin";
import {ChunkEntry} from "./type";

interface HtmlWebpackPluginsFactoryOptions {
    configChunkEntries: ChunkEntry[];
}

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
