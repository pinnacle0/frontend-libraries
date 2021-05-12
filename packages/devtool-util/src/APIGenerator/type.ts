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

export interface TypeDefinitionFieldConstraintSize {
    min: number;
    max: number;
}

export interface TypeDefinitionFieldConstraints {
    notNull: boolean | null;
    notBlank: boolean | null;
    min: number | null;
    max: number | null;
    size: TypeDefinitionFieldConstraintSize | null;
    pattern: string | null;
}

export type TypeParams = string[] | null;

export interface TypeDefinitionField {
    name: string;
    type: string;
    typeParams: TypeParams;
    constraints: TypeDefinitionFieldConstraints;
}

export interface TypeEnumConstant {
    name: string;
    value: string;
}

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

export enum TypeDefinitionType {
    Enum = "enum",
    Bean = "bean",
}

export interface TypeDefinition {
    name: string;
    type: TypeDefinitionType;
    fields: TypeDefinitionField[] | null;
    enumConstants: TypeEnumConstant[] | null;
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
