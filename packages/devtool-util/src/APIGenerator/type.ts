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

// TODO: use string literal union type
export enum TypeDefinitionType {
    Enum = "enum",
    Bean = "bean",
}

export interface TypeDefinitionField {
    name: string;
    type: string;
    typeParams: string[] | null;
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

// TODO: use string literal union type
export enum JavaType {
    String = "String",
    Boolean = "Boolean",
    Integer = "Integer",
    Long = "Long",
    Double = "Double",
    BigDecimal = "BigDecimal",
    ZonedDateTime = "ZonedDateTime",
    LocalDate = "LocalDate",
    LocalDateTime = "LocalDateTime",
    LocalTime = "LocalTime",
    List = "List",
    Map = "Map",
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
