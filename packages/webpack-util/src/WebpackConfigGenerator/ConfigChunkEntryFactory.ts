import fs from "fs";
import path from "path";
import {Constant} from "../Constant";
import type {ChunkEntry} from "../type";

interface ConfigChunkEntryOptions {
    indexName: string;
    projectSrcDirectory: string;
    extraChunks: Record<string, string>;
}

export class ConfigChunkEntryFactory {
    static generate({indexName, projectSrcDirectory, extraChunks}: ConfigChunkEntryOptions): ChunkEntry[] {
        const chunkEntries: ChunkEntry[] = [];

        const mainEntry = ConfigChunkEntryFactory.createEntry({
            name: indexName,
            directory: projectSrcDirectory,
        });
        chunkEntries.push(mainEntry);

        for (const [extraChunkName, extraChunkDirectory] of Object.entries(extraChunks)) {
            const extraEntry = ConfigChunkEntryFactory.createEntry({
                name: extraChunkName,
                directory: extraChunkDirectory,
            });
            chunkEntries.push(extraEntry);
        }

        return chunkEntries;
    }

    private static createEntry({name, directory}: {name: string; directory: string}): ChunkEntry {
        const chunkEntryPath = ConfigChunkEntryFactory.findEntryFilepath(directory);
        const htmlPath = ConfigChunkEntryFactory.findEntryHtmlFilepath(directory);

        if (chunkEntryPath === null) {
            throw new Error(`Cannot find entry file for "${name}" in "${directory}", files checked: ${Constant.mainChunkEntryNames.join("/")}`);
        }

        if (htmlPath === null) {
            // Output is a pure js chunk (without a companion `index.html` template file)
            // Do not include a hash in the output filenames.
            // One particular usecase for this is create a "third-party-error-handler" pure js chunk,
            // so this static filename can be hard coded at our backend.
            const outputFilename = "static/js/[name].js";
            return {name, chunkEntryPath, outputFilename};
        } else {
            // Output is html chunk (with a companion `index.html` template file)
            // We might want to include a hash to the output filenames
            // (don't set the output filename to contain hash for profiling build).
            const outputFilename = "static/js/[chunkhash:8].js";
            return {name, chunkEntryPath, outputFilename, htmlPath};
        }
    }

    private static findEntryFilepath(searchDirectory: string): string | null {
        if (!(fs.existsSync(searchDirectory) && fs.statSync(searchDirectory).isDirectory())) {
            return null;
        }
        for (const filename of Constant.mainChunkEntryNames) {
            const filepath = path.join(searchDirectory, filename);
            if (fs.existsSync(filepath) && fs.statSync(filepath).isFile()) {
                return filepath;
            }
        }
        return null;
    }

    private static findEntryHtmlFilepath(searchDirectory: string): string | null {
        if (!(fs.existsSync(searchDirectory) && fs.statSync(searchDirectory).isDirectory())) {
            return null;
        }
        const filepath = path.join(searchDirectory, "index.html");
        if (fs.existsSync(filepath) && fs.statSync(filepath).isFile()) {
            return filepath;
        }
        return null;
    }
}
