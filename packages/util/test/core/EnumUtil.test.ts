import {EnumUtil} from "../../src";

enum EmptyEnum {}
enum KVIdenticalStringEnum {
    A = "A",
    B = "B",
    C = "C",
}
enum KVDifferentStringEnum {
    AA = "A",
    BB = "B",
    CC = "C",
}
enum NumEnum {
    X,
    Y,
    Z,
}

describe("EnumUtil.toRecord", () => {
    test("empty enum", () => {
        expect(EnumUtil.toRecord(EmptyEnum, _ => 0)).toStrictEqual({});
    });
    test("enum with identical key/value pairs", () => {
        const record: Record<KVIdenticalStringEnum, string> = EnumUtil.toRecord(KVIdenticalStringEnum, _ => _.toLowerCase());
        expect(record).toStrictEqual({
            [KVIdenticalStringEnum.A]: "a",
            [KVIdenticalStringEnum.B]: "b",
            [KVIdenticalStringEnum.C]: "c",
        });
    });
    test("enum with non-same key/value pairs", () => {
        // @ts-expect-error
        EnumUtil.toRecord(NumEnum, _ => 0);
        // @ts-expect-error
        EnumUtil.toRecord(KVDifferentStringEnum, _ => 0);
    });
});

describe("EnumUtil.toArray", () => {
    test("empty enum", () => {
        expect(EnumUtil.toArray(EmptyEnum)).toStrictEqual([]);
    });
    test("enum with identical key/value pairs", () => {
        expect(EnumUtil.toArray(KVIdenticalStringEnum)).toStrictEqual([KVIdenticalStringEnum.A, KVIdenticalStringEnum.B, KVIdenticalStringEnum.C]);
    });
    test("enum with non-same key/value pairs", () => {
        // @ts-expect-error
        EnumUtil.toArray(NumEnum);
        // @ts-expect-error
        EnumUtil.toArray(KVDifferentStringEnum);
    });
});

describe("EnumUtil.fromValue", () => {
    test("empty enum", () => {
        expect(EnumUtil.fromValue(EmptyEnum, "any")).toBeNull();
    });

    test("enum with identical key/value pairs", () => {
        expect(EnumUtil.fromValue(KVIdenticalStringEnum, "A")).toStrictEqual(KVIdenticalStringEnum.A);
        expect(EnumUtil.fromValue(KVIdenticalStringEnum, "B")).toStrictEqual(KVIdenticalStringEnum.B);
        expect(EnumUtil.fromValue(KVIdenticalStringEnum, "D")).toBeNull();
        expect(EnumUtil.fromValue(KVIdenticalStringEnum, "")).toBeNull();
    });

    test("enum with non-same key/value pairs", () => {
        // @ts-expect-error
        EnumUtil.fromValue(NumEnum);
        // @ts-expect-error
        EnumUtil.fromValue(KVDifferentStringEnum);
    });
});
