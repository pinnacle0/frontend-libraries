export type StringBasedEnumMap<EnumMap> = {[P in keyof EnumMap]: EnumMap[P] & string};
export type StringBasedEnumValue<EnumMap> = EnumMap extends StringBasedEnumMap<EnumMap> ? EnumMap[keyof EnumMap] : never;

function toRecord<EnumMap extends StringBasedEnumMap<EnumMap>, V>(enumMap: EnumMap, mapperCallback: (item: StringBasedEnumValue<EnumMap>) => V): Record<StringBasedEnumValue<EnumMap>, V> {
    const result: {[key in StringBasedEnumValue<EnumMap>]?: V} = {};
    toArray(enumMap).forEach(item => (result[item] = mapperCallback(item)));
    return result as Record<StringBasedEnumValue<EnumMap>, V>;
}

function toArray<EnumMap extends StringBasedEnumMap<EnumMap>>(enumMap: EnumMap): StringBasedEnumValue<EnumMap>[] {
    return Object.values(enumMap);
}

function fromValue<EnumMap extends StringBasedEnumMap<EnumMap>>(enumMap: EnumMap, value: string): StringBasedEnumValue<EnumMap> | null {
    if (Object.values(enumMap).includes(value)) {
        return value as StringBasedEnumValue<EnumMap>;
    }
    return null;
}

export const EnumUtil = Object.freeze({
    toRecord,
    toArray,
    fromValue,
});
