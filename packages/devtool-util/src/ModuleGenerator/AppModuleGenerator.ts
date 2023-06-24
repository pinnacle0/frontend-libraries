import path from "path";
import {ModuleGeneratorBase} from "./ModuleGeneratorBase";
import type {PlatformSpecificModuleGeneratorOptions} from "./type";
import {Utility} from "../Utility";

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
