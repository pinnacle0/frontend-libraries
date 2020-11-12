import {Constant} from "../Constant";
import {Utility} from "./Utility";

interface WebpackResolveExtensionsFactoryOptions {
    extraPrioritizedResolvedExtensions?: string[] | undefined;
}

export class WebpackResolveExtensionsFactory {
    static generate({extraPrioritizedResolvedExtensions = []}: WebpackResolveExtensionsFactoryOptions): string[] {
        for (const ext of extraPrioritizedResolvedExtensions) {
            Utility.validateFileExtension(ext);
        }

        const resolveExtensions = [];

        for (const ext of Constant.chunkExtensions) {
            resolveExtensions.push(ext);
        }

        return resolveExtensions;
    }
}
