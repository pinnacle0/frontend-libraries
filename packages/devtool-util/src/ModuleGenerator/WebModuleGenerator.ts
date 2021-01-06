import path from "path";
import {ModuleGeneratorBase} from "./ModuleGeneratorBase";
import type {PlatformSpecificModuleGeneratorOptions} from "./type";

export class WebModuleGenerator extends ModuleGeneratorBase {
    constructor(options: PlatformSpecificModuleGeneratorOptions) {
        super({
            ...options,
            templateDirectory: path.join(__dirname, "./core-fe-template"),
            generateImportStatementForNewModuleState({moduleStateName, partialModulePath}) {
                return `import type {State as ${moduleStateName}} from "module/${partialModulePath}/type";`;
            },
        });
    }
}
