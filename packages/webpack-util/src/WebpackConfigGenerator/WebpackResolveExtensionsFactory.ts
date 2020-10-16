import {Constant} from "./Constant";
import {Utility} from "./Utility";

interface WebpackResolveExtensionsFactoryOptions {
    extraResolvedExtensions?: string[] | undefined;
}

export class WebpackResolveExtensionsFactory {
    private readonly resolveExtensions: string[];

    constructor(private readonly options: WebpackResolveExtensionsFactoryOptions) {
        this.resolveExtensions = [];
        this.validateOptions();
        for (const ext of Constant.chunkExtensions) {
            this.resolveExtensions.push(ext);
        }
        for (const ext of this.options.extraResolvedExtensions || []) {
            this.resolveExtensions.push(ext);
        }
        Object.freeze(this);
    }

    get(): string[] {
        Object.freeze(this.resolveExtensions);
        return this.resolveExtensions;
    }

    private validateOptions(): void {
        for (const ext of this.options.extraResolvedExtensions || []) {
            Utility.validateFileExtension(ext);
        }
    }
}
