import {Constant} from "../Constant";
import {Utility} from "./Utility";

interface WebpackResolveExtensionsFactoryOptions {
    extraResolvedExtensions?: string[] | undefined;
}

export class WebpackResolveExtensionsFactory {
    static generate({extraResolvedExtensions = []}: WebpackResolveExtensionsFactoryOptions): string[] {
        for (const ext of extraResolvedExtensions) {
            Utility.validateFileExtension(ext);
        }

        const resolveExtensions = [];

        for (const ext of Constant.chunkExtensions) {
            resolveExtensions.push(ext);
        }

        for (const ext of extraResolvedExtensions) {
            resolveExtensions.push(ext);
        }

        return resolveExtensions;
    }
}
