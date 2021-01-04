export interface ModuleGeneratorOptions {
    srcDirectory: string;
    templateDirectory: string;
    generateImportStatementForNewModuleState: (_: {moduleStateName: string; partialModulePath: string}) => string;
}

export interface PlatformSpecificModuleGeneratorOptions {
    srcDirectory: string;
}
