import {APIGeneratorBase} from "./APIGeneratorBase";
import {PlatformSpecificAPIGeneratorOptions} from "./types";

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
