import type webpack from "webpack";
import type {ChunkEntry} from "../type";

interface StrictWebpackEntry {
    [entryName: string]: [string];
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
