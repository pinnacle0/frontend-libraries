import fs from "fs";
import path from "path";
import {ChunkEntry} from "./type";
import {Utility} from "./Utility";

interface ConfigChunkEntryOptions {
    indexName: string;
    projectSrcDirectory: string;
    extraChunks: Record<string, string>;
}

export class ConfigChunkEntryFactory {
    private readonly createError = Utility.taggedErrorFactory("[ConfigGenerator.ConfigChunkEntryFactory]");
    private readonly chunkEntries: ChunkEntry[];

    constructor(private readonly options: ConfigChunkEntryOptions) {
        const {indexName, projectSrcDirectory, extraChunks} = this.options;
        this.chunkEntries = [];
        this.validateAndPushEntry({name: indexName, directory: projectSrcDirectory});
        for (const [extraChunkName, extraChunkDirectory] of Object.entries(extraChunks)) {
            this.validateAndPushEntry({name: extraChunkName, directory: extraChunkDirectory});
        }
        Object.freeze(this);
    }

    get(): Array<ChunkEntry> {
        this.chunkEntries.forEach(entry => Object.freeze(entry));
        Object.freeze(this.chunkEntries);
        return this.chunkEntries;
    }

    private validateAndPushEntry = ({name, directory}: {name: string; directory: string}): void => {
        if (!(fs.existsSync(directory) && fs.statSync(directory).isDirectory())) {
            throw this.createError(`Cannot compute entry path for "${name}" because "${directory}" is not a directory.`);
        }
        const files = ["index.tsx", "index.ts", "index.jsx", "index.js", "index.less", "index.css"];
        for (const file of files) {
            const chunkEntryPath = path.join(directory, file);
            if (fs.existsSync(chunkEntryPath) && fs.statSync(chunkEntryPath).isFile()) {
                const chunkEntry: ChunkEntry = {name, chunkEntryPath};
                const htmlPath = path.join(directory, "index.html");
                if (fs.existsSync(htmlPath) && fs.statSync(htmlPath).isFile()) {
                    chunkEntry.htmlPath = htmlPath;
                }
                this.chunkEntries.push(chunkEntry);
                return;
            }
        }
        throw this.createError(`Cannot find entry file for "${name}" at directory "${directory}", files checked: ${files.join("/")}`);
    };
}
