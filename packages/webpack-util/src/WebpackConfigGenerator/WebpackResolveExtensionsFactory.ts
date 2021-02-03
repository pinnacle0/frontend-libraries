import {Constant} from "../Constant";

interface WebpackResolveExtensionsFactoryOptions {
    prioritizedExtensionPrefixes?: string[] | undefined;
}

export class WebpackResolveExtensionsFactory {
    static generate({prioritizedExtensionPrefixes = []}: WebpackResolveExtensionsFactoryOptions): string[] {
        const resolveExtensions = [];

        for (const prefix of prioritizedExtensionPrefixes) {
            const extensions = [
                `.${prefix}.ts`,
                `.${prefix}.tsx`,
                `.${prefix}.js`,
                `.${prefix}.jsx`,
                `.${prefix}.less`,
                `.${prefix}.css`,
                // prettier-format-preserve
            ];
            resolveExtensions.push(...extensions);
        }

        resolveExtensions.push(...Constant.resolveExtensions);

        return resolveExtensions;
    }
}
