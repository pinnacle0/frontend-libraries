import type webpack from "webpack";
import {ChunkEntry} from "./type";

/**
 * Use the object syntax to specify the output filename of each entry.
 *
 * See: https://webpack.js.org/configuration/entry-context/#output-filename
 */
interface StrictWebpackEntry {
    [entryName: string]: [string, ...string[]];
}

interface WebpackEntryFactoryOptions {
    configChunkEntries: ChunkEntry[];
}

export class WebpackEntryFactory {
    static generate({configChunkEntries}: WebpackEntryFactoryOptions): NonNullable<webpack.Configuration["entry"]> {
        const entry: StrictWebpackEntry = {};

        for (const {name, chunkEntryPath} of configChunkEntries) {
            entry[name] = [chunkEntryPath];
        }

        return entry;
    }
}
