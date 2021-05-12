import {JavaType, TypeDefinitionType} from "../type";
import type {TypeDefinition, TypeDefinitionFieldConstraints} from "../type";

// TODO: move to upper folder

// TODO: javaToTSType
const getTypeScriptType = (javaTypeOrCustomizedType: string): string => {
    switch (javaTypeOrCustomizedType) {
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
            return javaTypeOrCustomizedType;
    }
};

const getFieldDefinitionType = (type: TypeDefinitionType | string, typeParams?: string[] | null): string => {
    if (type === JavaType.List) {
        return typeParams![0] + "[]";
    } else if (type === JavaType.Map) {
        const keyType = typeParams![0] === JavaType.String ? "[key:string]" : `[key in ${typeParams![0]}]?`;
        const valueType = typeParams![1] === JavaType.List ? typeParams![2] + "[]" : typeParams![1];
        return `{${keyType}: ${valueType}}`;
    } else {
        return getTypeScriptType(type);
    }
};

const getFieldConstraintsComment = (constraints: TypeDefinitionFieldConstraints): string => {
    // TODO: refactor
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
    } else {
        return " // constraints: " + rules.join(", ");
    }
};

const generate = (types: TypeDefinition[]): string[] => {
    const exportTypeMap: Record<TypeDefinitionType, string> = {
        [TypeDefinitionType.Enum]: "enum",
        [TypeDefinitionType.Bean]: "interface",
    };

    return types.map(({type, name, fields, enumConstants}: TypeDefinition): string => {
        const exportType = exportTypeMap[type];
        const getExportDefinitionContent = (): string => {
            switch (type) {
                case TypeDefinitionType.Bean:
                    return fields!
                        .map(field => {
                            const fieldName = field.name;
                            const nullability = field.constraints.notNull ? "" : " | null";
                            const fieldDefinitionType = getFieldDefinitionType(field.type, field.typeParams) + nullability;
                            const fieldConstraintsComment = getFieldConstraintsComment(field.constraints);

                            return `${fieldName}: ${fieldDefinitionType};${fieldConstraintsComment}`;
                        })
                        .join("\n");
                case TypeDefinitionType.Enum:
                    return enumConstants!.map(constant => `${constant.name} = "${constant.value}",`).join("\n");
            }
        };

        return `export ${exportType} ${name} {${getExportDefinitionContent()}}`;
    });
};

// TODO: export const TypeScriptDefinitionGenerator = Object.freeze({..})
const TypeScriptDefinitionGenerator = {
    getTypeScriptType,
    generate,
};

export default TypeScriptDefinitionGenerator;
