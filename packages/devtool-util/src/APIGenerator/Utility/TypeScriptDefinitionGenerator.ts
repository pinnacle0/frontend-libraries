import {JavaType, TypeDefinitionType} from "../type";
import type {TypeParams, TypeDefinition, TypeDefinitionFieldConstraints} from "../type";
import {Utility} from "../../Utility";

const typeDefinitionGeneratorLogger = Utility.createConsoleLogger("Generate TypeScript Definition");

const capitalize = (str: string): string => str[0].toLocaleUpperCase() + str.slice(1);

const byTypeAndName = (a: {name: string; type: string}, b: {name: string; type: string}) => {
    if (a.type !== b.type) {
        return a.type.localeCompare(b.type);
    }
    return a.name.localeCompare(b.name);
};

const exportTypeDefinitionTypeMap: {[TypeDefinitionType.Enum]: "enum"; [TypeDefinitionType.Bean]: "interface"} = {
    [TypeDefinitionType.Enum]: "enum",
    [TypeDefinitionType.Bean]: "interface",
};

const getTypeScriptType = (javaType?: TypeDefinitionType | string): string => {
    if (typeof javaType === "undefined") {
        return "any";
    }

    switch (javaType) {
        case JavaType.String:
            return "string";

        case JavaType.Boolean:
            return "boolean";

        case JavaType.Integer:
        case JavaType.Long:
        case JavaType.Double:
        case JavaType.BigDecimal:
            return "number";

        case JavaType.ZonedDateTime:
            return "Date";

        case JavaType.LocalDate:
        case JavaType.LocalDateTime:
        case JavaType.LocalTime:
            return "string"; // in ts/js, Date is always convert to ISO datetime utc format, so here use string for date/datetime without timezone

        default:
            return javaType;
    }
};

const getArrayType = (typeParams: TypeParams): string => {
    return getFieldDefinitionType(typeParams![0], typeParams!.slice(1)) + "[]";
};

const getMapType = (typeParams: TypeParams): string => {
    const keyType = !typeParams![0] || typeParams![0] === JavaType.String ? "[key:string]:" : `[key in ${typeParams![0]}]?:`;
    const valueType = typeParams![1] === JavaType.List ? getArrayType(typeParams!.slice(2)) : getFieldDefinitionType(typeParams![1], typeParams!.slice(2));

    return `{ ${keyType} ${valueType}; }`;
};

const getFieldDefinitionType = (type?: TypeDefinitionType | string, typeParams?: TypeParams): string => {
    if (type === JavaType.List) {
        return getArrayType(typeParams!);
    }

    if (type === JavaType.Map) {
        return getMapType(typeParams!);
    }

    return getTypeScriptType(type);
};

const getFieldConstraintsComment = (constraints: TypeDefinitionFieldConstraints): string => {
    const rulesMap = {
        "notBlank=true`": constraints.notBlank,
        [`min=${constraints.min}`]: constraints.min !== null,
        [`max=${constraints.max}`]: constraints.max !== null,
        [`size=(${constraints.size?.min}, ${constraints.size?.max})`]: constraints.size !== null,
        [`pattern=${constraints.pattern}`]: constraints.pattern !== null,
    };

    const rules = Object.keys(rulesMap).filter(key => rulesMap[key]);

    if (rules.length === 0) {
        return "";
    }

    return " // constraints: " + rules.join(", ");
};

const generateTypeDefinition = ({type, name, fields, enumConstants}: TypeDefinition): string => {
    const exportType = exportTypeDefinitionTypeMap[type];

    const getExportDefinitionContent = () => {
        typeDefinitionGeneratorLogger.info(`Extracting ${capitalize(exportType)}: ${name}`);

        if (type === TypeDefinitionType.Bean) {
            return fields!
                .sort(byTypeAndName)
                .map(field => {
                    const fieldName = field.name;
                    const nullability = field.constraints.notNull ? "" : " | null";
                    const fieldDefinitionType = getFieldDefinitionType(field.type, field.typeParams) + nullability;
                    const fieldConstraintsComment = getFieldConstraintsComment(field.constraints);

                    return `${fieldName}: ${fieldDefinitionType};${fieldConstraintsComment}`;
                })
                .join("\n");
        } else if (type === TypeDefinitionType.Enum) {
            return enumConstants!.map(constant => `${constant.name} = "${constant.value}",`).join("\n");
        }
        return "";
    };

    return [`export ${exportType} ${name} {`, getExportDefinitionContent(), `}`].join("\n") + "\n";
};

const generate = (types: TypeDefinition[]) => {
    return types!.sort(byTypeAndName).map(generateTypeDefinition);
};

const TypeScriptDefinitionGenerator = {
    getTypeScriptType,
    generate,
};

export default TypeScriptDefinitionGenerator;
