import path from "path";
import {ModuleGeneratorBase} from "./ModuleGeneratorBase";
import type {PlatformSpecificModuleGeneratorOptions} from "./type";

export class AppModuleGenerator extends ModuleGeneratorBase {
    constructor(options: PlatformSpecificModuleGeneratorOptions) {
        super({
            ...options,
            templateDirectory: path.join(__dirname, "./core-native-template"),
            generateImportStatementForNewModuleState({moduleStateName, partialModulePath}) {
                return `import type {State as ${moduleStateName}} from "app/module/${partialModulePath}/type";`;
            },
        });
    }
}
