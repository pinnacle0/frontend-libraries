import fs from "fs";
import path from "path";
import {Constant} from "../Constant";
import type {EntryDescriptor} from "../type";

interface ConfigEntryDescriptorsFactoryOptions {
    indexName: string;
    projectSrcDirectory: string;
    extraEntries: Record<string, string>;
}

export class ConfigEntryDescriptorsFactory {
    static generate({indexName, projectSrcDirectory, extraEntries}: ConfigEntryDescriptorsFactoryOptions): EntryDescriptor[] {
        const entryDescriptors: EntryDescriptor[] = [];

        const mainEntryDescriptor = ConfigEntryDescriptorsFactory.createEntryDescriptor({
            name: indexName,
            directory: projectSrcDirectory,
        });
        entryDescriptors.push(mainEntryDescriptor);

        for (const [extraEntryName, extraEntryDirectory] of Object.entries(extraEntries)) {
            const extraEntryDescriptor = ConfigEntryDescriptorsFactory.createEntryDescriptor({
                name: extraEntryName,
                directory: extraEntryDirectory,
            });
            entryDescriptors.push(extraEntryDescriptor);
        }

        return entryDescriptors;
    }

    private static createEntryDescriptor({name, directory}: {name: string; directory: string}): EntryDescriptor {
        const entryPath = ConfigEntryDescriptorsFactory.findEntryFilepath(directory);
        const htmlPath = ConfigEntryDescriptorsFactory.findEntryHtmlFilepath(directory);

        if (entryPath === null) {
            throw new Error(`Cannot find entry file for "${name}" in "${directory}", files checked: ${Constant.mainEntryFilenames.join("/")}`);
        }

        if (htmlPath === null) {
            // Output is a pure js entry (without a companion `index.html` template file)
            // Do not include a hash in the output filenames.
            // One particular use case for this is create a "third-party-error-handler" pure js entry,
            // so this static filename can be hard coded at our backend.
            const outputFilename = "static/js/[name].js";
            return {name, entryPath, outputFilename};
        } else {
            // Output is an html entry (with a companion `index.html` template file)
            // We might want to include a hash to the output filenames
            // (don't set the output filename to contain hash for profiling build).
            const outputFilename = "static/js/[chunkhash:8].js";
            return {name, entryPath, outputFilename, htmlPath};
        }
    }

    private static findEntryFilepath(searchDirectory: string): string | null {
        if (!(fs.existsSync(searchDirectory) && fs.statSync(searchDirectory).isDirectory())) {
            return null;
        }
        for (const filename of Constant.mainEntryFilenames) {
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
