import type {Configuration} from "@rspack/core";
import type {EntryDescriptor} from "../type.js";

interface StrictWebpackEntry {
    [entryName: string]: [string];
}

interface WebpackEntryFactoryOptions {
    configEntryDescriptors: EntryDescriptor[];
}

export class WebpackEntryFactory {
    static generate({configEntryDescriptors}: WebpackEntryFactoryOptions): NonNullable<Configuration["entry"]> {
        const entry: StrictWebpackEntry = {};

        for (const {name, entryPath} of configEntryDescriptors) {
            entry[name] = [entryPath];
        }

        return entry;
    }
}
