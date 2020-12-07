export type KVIdenticalEnumMap<EnumType extends string> = {[P in EnumType]: P};

function toRecord<EnumType extends string, V>(enumMap: KVIdenticalEnumMap<EnumType>, mapperCallback: (item: EnumType) => V): Record<EnumType, V> {
    const result: {[key in EnumType]?: V} = {};
    toArray(enumMap).forEach(item => (result[item] = mapperCallback(item)));
    return result as Record<EnumType, V>;
}

function toArray<EnumType extends string>(enumMap: KVIdenticalEnumMap<EnumType>): EnumType[] {
    return Object.values(enumMap);
}

function fromValue<EnumType extends string>(enumMap: KVIdenticalEnumMap<EnumType>, value: string): EnumType | null {
    if (Object.values(enumMap).includes(value)) {
        return value as EnumType;
    }
    return null;
}

export const EnumUtil = Object.freeze({
    toRecord,
    toArray,
    fromValue,
});
