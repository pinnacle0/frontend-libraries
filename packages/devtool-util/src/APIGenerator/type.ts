export interface APIDefinition {
    services: ServiceDefinition[];
    types: TypeDefinition[];
}

export interface ServiceDefinition {
    name: string;
    operations: ServiceOperation[];
}

export interface ServiceOperation {
    name: string;
    method: "DELETE" | "GET" | "POST" | "PUT";
    path: string;
    pathParams: {name: string; type: string}[];
    responseType: string;
    requestType: null | string;
}

export interface TypeDefinition {
    name: string;
    type: TypeDefinitionType;
    fields: TypeDefinitionField[] | null;
    enumConstants: TypeEnumConstant[] | null;
}

export type TypeDefinitionType = "enum" | "bean";

export type JavaType = "String" | "Boolean" | "Integer" | "Long" | "Double" | "BigDecimal" | "ZonedDateTime" | "LocalDate" | "LocalDateTime" | "LocalTime" | "List" | "Map";

export interface TypeDefinitionField {
    name: string;
    type: JavaType | string;
    typeParams: (JavaType | string)[] | null;
    constraints: TypeDefinitionFieldConstraints;
}

export interface TypeDefinitionFieldConstraints {
    notNull: boolean | null;
    notBlank: boolean | null;
    min: number | null;
    max: number | null;
    size: {min: number; max: number} | null;
    pattern: string | null;
}

export interface TypeEnumConstant {
    name: string;
    value: string;
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
