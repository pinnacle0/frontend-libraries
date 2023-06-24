import {ModuleGeneratorBase} from "./ModuleGeneratorBase";
import type {PlatformSpecificModuleGeneratorOptions} from "./type";
import {Utility} from "../Utility";

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
