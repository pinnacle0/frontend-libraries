import {APIGeneratorBase} from "./APIGeneratorBase.js";
import type {PlatformSpecificAPIGeneratorOptions} from "./type.js";

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
