import {ModuleGeneratorBase} from "./ModuleGeneratorBase.js";
import type {PlatformSpecificModuleGeneratorOptions} from "./type.js";
import {Utility} from "../Utility/index.js";

export class AppModuleGenerator extends ModuleGeneratorBase {
    constructor(options: PlatformSpecificModuleGeneratorOptions) {
        super({
            ...options,
            templateDirectory: Utility.getTemplatePath("core-native"),
            generateImportStatementForNewModuleState({moduleStateName, partialModulePath}) {
                return `import type {State as ${moduleStateName}} from "app/module/${partialModulePath}/type";`;
            },
        });
    }
}
