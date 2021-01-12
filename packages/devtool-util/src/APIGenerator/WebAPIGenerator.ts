import {APIGeneratorBase} from "./APIGeneratorBase";
import type {PlatformSpecificAPIGeneratorOptions} from "./type";

export class WebAPIGenerator extends APIGeneratorBase {
    constructor(options: PlatformSpecificAPIGeneratorOptions) {
        super({
            ...options,
            platformConfig: {
                ajaxFunction: "ajax",
                ajaxFunctionImportStatement: 'import {ajax} from "core-fe";',
                typeFileImportPath: "type/api",
            },
        });
    }
}
