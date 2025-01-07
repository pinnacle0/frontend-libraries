import {ModuleGeneratorBase} from "./ModuleGeneratorBase.js";
import type {PlatformSpecificModuleGeneratorOptions} from "./type.js";
import {Utility} from "../Utility/index.js";

export class WebModuleGenerator extends ModuleGeneratorBase {
    constructor(options: PlatformSpecificModuleGeneratorOptions) {
        super({
            ...options,
            templateDirectory: Utility.getTemplatePath("core-fe"),
            generateImportStatementForNewModuleState({moduleStateName, partialModulePath}) {
                return `import type {State as ${moduleStateName}} from "module/${partialModulePath}/type";`;
            },
        });
    }
}
