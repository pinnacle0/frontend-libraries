import type {TypeDefinition, TypeDefinitionType, TypeDefinitionFieldConstraints, JavaType, TypeDefinitionField, IgnoreType, TypeEnumConstant} from "./type";

const javaToTSType = (javaTypeOrCustomizedType: JavaType | string): string => {
    switch (javaTypeOrCustomizedType) {
        case "String":
            return "string";

        case "Boolean":
            return "boolean";

        case "Integer":
        case "Long":
        case "Double":
        case "BigDecimal":
            return "number";

        case "ZonedDateTime":
            return "Date";

        case "LocalDate":
        case "LocalDateTime":
        case "LocalTime":
            return "string"; // in ts/js, Date is always convert to ISO datetime utc format, so here use string for date/datetime without timezone

        default:
            return javaTypeOrCustomizedType;
    }
};

const getFieldDefinitionType = ({type, typeParams}: TypeDefinitionField): string => {
    if (type === "List") {
        return javaToTSType(typeParams![0]) + "[]";
    } else if (type === "Map") {
        const keyType = typeParams![0] === "String" ? "[key:string]" : `[key in ${javaToTSType(typeParams![0])}]?`;
        const valueType = typeParams![1] === "List" ? javaToTSType(typeParams![2]) + "[]" : javaToTSType(typeParams![1]);
        return `{${keyType}: ${valueType}}`;
    } else {
        return javaToTSType(type);
    }
};

const getFieldConstraintsComment = (constraints: TypeDefinitionFieldConstraints): string => {
    const builder = [];
    if (constraints.notBlank === true) {
        builder.push(`notBlank=true`);
    }
    if (constraints.min !== null) {
        builder.push(`min=${constraints.min}`);
    }
    if (constraints.max !== null) {
        builder.push(`max=${constraints.max}`);
    }
    if (constraints.size !== null) {
        builder.push(`size=(${constraints.size.min}, ${constraints.size.max})`);
    }
    if (constraints.pattern !== null) {
        builder.push(`pattern=${constraints.pattern}`);
    }
    if (builder.length === 0) {
        return "";
    } else {
        return " // constraints: " + builder.join(", ");
    }
};

const generate = (types: TypeDefinition[], ignoreTypes?: IgnoreType): string[] => {
    const exportTypeMap: Record<TypeDefinitionType, "enum" | "interface"> = {
        enum: "enum",
        bean: "interface",
    };

    return types.map(({type, name, fields, enumConstants}: TypeDefinition): string => {
        const exportType = exportTypeMap[type];
        const ignoreFieldsOrConstant = ignoreTypes?.[exportType]?.[name];
        const getExportDefinitionContent = (): string => {
            switch (type) {
                case "bean":
                    return fields!
                        .map((field: TypeDefinitionField) => {
                            if (ignoreFieldsOrConstant?.includes(field.name)) {
                                return null;
                            }
                            const fieldName = field.name;
                            const nullability = field.constraints.notNull ? "" : " | null";
                            const fieldDefinitionType = getFieldDefinitionType(field) + nullability;
                            const fieldConstraintsComment = getFieldConstraintsComment(field.constraints);

                            return `${fieldName}: ${fieldDefinitionType};${fieldConstraintsComment}`;
                        })
                        .filter(_ => _ !== null)
                        .join("\n");
                case "enum":
                    return enumConstants!
                        .map((constant: TypeEnumConstant) => {
                            if (ignoreFieldsOrConstant?.includes(constant.name)) {
                                return null;
                            }
                            return `${constant.name} = "${constant.value}",`;
                        })
                        .filter(_ => _ !== null)
                        .join("\n");
            }
        };

        return `export ${exportType} ${name} {${getExportDefinitionContent()}\n}\n`;
    });
};

export const TypeScriptDefinitionGenerator = Object.freeze({
    javaToTSType,
    generate,
});
