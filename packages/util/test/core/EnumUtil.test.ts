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
        expect(EnumUtil.toRecord(EmptyEnum, () => 0)).toStrictEqual({});
    });
    test("enum with identical key/value pairs", () => {
        const record = EnumUtil.toRecord(KVIdenticalStringEnum, _ => _.toLowerCase());
        expect(record).toStrictEqual({
            [KVIdenticalStringEnum.A]: "a",
            [KVIdenticalStringEnum.B]: "b",
            [KVIdenticalStringEnum.C]: "c",
        });
    });
    test("enum with different key/value pairs", () => {
        const record = EnumUtil.toRecord(KVDifferentStringEnum, _ => _.toLowerCase());
        expect(record).toStrictEqual({
            [KVDifferentStringEnum.AA]: "a",
            [KVDifferentStringEnum.BB]: "b",
            [KVDifferentStringEnum.CC]: "c",
        });
    });
    test("enum with numeric key/value pairs", () => {
        // @ts-expect-error
        EnumUtil.toRecord(NumEnum, () => 0);
    });
});

describe("EnumUtil.toArray", () => {
    test("empty enum", () => {
        expect(EnumUtil.toArray(EmptyEnum)).toStrictEqual([]);
    });
    test("enum with identical key/value pairs", () => {
        // Important: list's type should be inferred as KVIdenticalStringEnum[], not ("A" | "B" | "C")[]
        const list = EnumUtil.toArray(KVIdenticalStringEnum);
        expect(list).toStrictEqual([KVIdenticalStringEnum.A, KVIdenticalStringEnum.B, KVIdenticalStringEnum.C]);
    });
    test("enum with different key/value pairs", () => {
        const list = EnumUtil.toArray(KVDifferentStringEnum);
        expect(list).toStrictEqual([KVDifferentStringEnum.AA, KVDifferentStringEnum.BB, KVDifferentStringEnum.CC]);
        expect(list).toStrictEqual(["A", "B", "C"] as KVDifferentStringEnum[]);
    });
    test("enum with numeric key/value pairs", () => {
        // @ts-expect-error
        EnumUtil.toArray(NumEnum);
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
        expect(EnumUtil.fromValue(KVIdenticalStringEnum, " ")).toBeNull();
        expect(EnumUtil.fromValue(KVIdenticalStringEnum, "")).toBeNull();
    });
    test("enum with different key/value pairs", () => {
        expect(EnumUtil.fromValue(KVDifferentStringEnum, "A")).toStrictEqual(KVDifferentStringEnum.AA);
        expect(EnumUtil.fromValue(KVDifferentStringEnum, "B")).toStrictEqual(KVDifferentStringEnum.BB);
        expect(EnumUtil.fromValue(KVIdenticalStringEnum, "AA")).toBeNull();
        expect(EnumUtil.fromValue(KVIdenticalStringEnum, "BB")).toBeNull();
        expect(EnumUtil.fromValue(KVIdenticalStringEnum, "a")).toBeNull();
        expect(EnumUtil.fromValue(KVIdenticalStringEnum, "")).toBeNull();
    });
    test("enum with numeric key/value pairs", () => {
        // @ts-expect-error
        EnumUtil.fromValue(NumEnum);
    });
});
