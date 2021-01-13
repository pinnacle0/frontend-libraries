export interface APIDefinition {
    services: ServiceDefinition[];
    types: TypeDefinition[];
}

export interface ServiceDefinition {
    name: string;
    operations: Operation[];
}

export interface Operation {
    name: string;
    method: "DELETE" | "GET" | "POST" | "PUT";
    path: string;
    pathParams: {name: string; type: string}[];
    responseType: string;
    requestType: null | string;
}

export interface TypeDefinition {
    name: string;
    type: "enum" | "interface";
    definition: string;
}

export interface PlatformConfig {
    ajaxFunction: string;
    ajaxFunctionImportStatement: string;
    typeFileImportPath: string;
}

export interface APIGeneratorOptions {
    metadataEndpointURL: string;
    typeFilePath: string;
    serviceFolderPath: string;
    platformConfig: PlatformConfig;
}

export type PlatformSpecificAPIGeneratorOptions = Omit<APIGeneratorOptions, "platformConfig">;
