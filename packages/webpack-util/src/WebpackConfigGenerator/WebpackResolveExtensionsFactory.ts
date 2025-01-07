import {Constant} from "../Constant.js";

interface WebpackResolveExtensionsFactoryOptions {
    prioritizedExtensionPrefixes?: string[] | undefined;
}

export class WebpackResolveExtensionsFactory {
    static generate({prioritizedExtensionPrefixes = []}: WebpackResolveExtensionsFactoryOptions): string[] {
        const resolveExtensions = [];

        for (const prefix of prioritizedExtensionPrefixes) {
            resolveExtensions.push(...Constant.resolveExtensions.map(_ => `.${prefix}${_}`));
        }

        resolveExtensions.push(...Constant.resolveExtensions);

        return resolveExtensions;
    }
}
