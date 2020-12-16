export interface ModuleGeneratorOptions {
    srcDirectory: string;
    templateDirectory: string;
    generateImportStatementForNewModuleState: (_: {moduleStateName: string; partialModulePath: string}) => string;
}

export type PlatformSpecificModuleGeneratorOptions = Omit<ModuleGeneratorOptions, "templateDirectory" | "generateImportStatementForNewModuleState">;
