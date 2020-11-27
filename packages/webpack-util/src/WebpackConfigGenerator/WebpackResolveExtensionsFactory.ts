import {Constant} from "../Constant";

interface WebpackResolveExtensionsFactoryOptions {
    extraPrioritizedResolvedExtensions?: string[] | undefined;
}

export class WebpackResolveExtensionsFactory {
    static generate({extraPrioritizedResolvedExtensions = []}: WebpackResolveExtensionsFactoryOptions): string[] {
        const resolveExtensions = [];

        for (const ext of extraPrioritizedResolvedExtensions) {
            resolveExtensions.push(ext);
        }

        for (const ext of Constant.resolveExtensions) {
            resolveExtensions.push(ext);
        }

        return resolveExtensions;
    }
}
