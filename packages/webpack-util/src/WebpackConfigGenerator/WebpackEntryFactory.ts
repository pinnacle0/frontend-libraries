import type webpack from "webpack";
import type {EntryDescriptor} from "../type";

interface StrictWebpackEntry {
    [entryName: string]: [string];
}

interface WebpackEntryFactoryOptions {
    configEntryDescriptors: EntryDescriptor[];
}

export class WebpackEntryFactory {
    static generate({configEntryDescriptors}: WebpackEntryFactoryOptions): NonNullable<webpack.Configuration["entry"]> {
        const entry: StrictWebpackEntry = {};

        for (const {name, entryPath} of configEntryDescriptors) {
            entry[name] = [entryPath];
        }

        return entry;
    }
}
