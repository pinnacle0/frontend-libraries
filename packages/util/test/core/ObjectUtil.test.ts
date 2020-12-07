import {ObjectUtil} from "../../src/core/ObjectUtil";

test("First Key", () => {
    expect(ObjectUtil.firstKey({})).toBeNull();
    expect(ObjectUtil.firstKey({a: 1, b: 2, c: 3})).toBe("a");
    expect(ObjectUtil.firstKey({b: 2, a: 1, c: 3})).toBe("b");
});

test("Object Safe Assign", () => {
    const object = {a: 1, b: 2, c: 3};
    ObjectUtil.safeAssign(object, {a: 10});
    expect(object).toEqual({a: 10, b: 2, c: 3});

    ObjectUtil.safeAssign(object, {c: -10});
    expect(object).toEqual({a: 10, b: 2, c: -10});

    ObjectUtil.safeAssign(object, null);
    expect(object).toEqual({a: 10, b: 2, c: -10});

    // Type infer test
    const test1: {a: number} | undefined = {a: 23};
    ObjectUtil.safeAssign(test1, {a: 1});

    const test2: {a: number; b: boolean} | null = {a: 23, b: false};
    ObjectUtil.safeAssign(test2, {});
    ObjectUtil.safeAssign(test2, {a: 1});
    ObjectUtil.safeAssign(test2, null);
    ObjectUtil.safeAssign(test2, {b: false});
    ObjectUtil.safeAssign(test2, {a: -1, b: false});

    // @ts-expect-error
    ObjectUtil.safeAssign(test2, {a: false});
    // @ts-expect-error
    ObjectUtil.safeAssign(test2, {foo: 10});
    // @ts-expect-error
    ObjectUtil.safeAssign(null, {});
    // @ts-expect-error
    ObjectUtil.safeAssign(undefined, {});

    const makeState = (): {data: Array<{foo: string; bar: number}>; filter: {pageIndex: number}} => {
        return {data: [], filter: {pageIndex: 1}};
    };
    const newData = [{foo: "one", bar: 1}];

    ObjectUtil.safeAssign(makeState(), {data: newData});

    // @ts-expect-error
    ObjectUtil.safeAssign(makeState(), {wrong: ""});

    // @ts-expect-error
    ObjectUtil.safeAssign(makeState(), {data: newData, wrong: ""});
});

test("Map To Object", () => {
    expect(ObjectUtil.toObject({a: 1, b: 2, c: 3}, (key, item, index) => index)).toEqual({a: 0, b: 1, c: 2});
    expect(ObjectUtil.toObject({a: "a", b: 2, c: 3}, (key, item) => item)).toEqual({a: "a", b: 2, c: 3});
    expect(ObjectUtil.toObject({a: 1, b: 2, c: 3}, key => key)).toEqual({a: "a", b: "b", c: "c"});
    expect(ObjectUtil.toObject({a: 1, b: 2, c: undefined}, (key, item) => item)).not.toHaveProperty("c");
    expect(ObjectUtil.toObject({a: 1, b: 2}, (key, item) => item)).not.toHaveProperty("c");
});

test("Map To Array", () => {
    const object = {a: "a", b: "b", 1: "c", 2: "d", j: undefined};

    expect(ObjectUtil.toArray(object, key => key)).toEqual(["1", "2", "a", "b"]);
    expect(ObjectUtil.toArray(object, (key, item) => item)).toEqual(["c", "d", "a", "b"]);
    expect(ObjectUtil.toArray(object, (key, item, index) => index)).toEqual([0, 1, 2, 3]);
    // @ts-expect-error
    ObjectUtil.toArray(object, () => undefined);

    enum TestEnum {
        A = "A",
        B = "B",
        C = "C",
    }
    const fullMap: {[key in TestEnum]: string | null} = {[TestEnum.A]: "AAA", [TestEnum.B]: "BBB", [TestEnum.C]: null};
    const partialMap: {[key in TestEnum]?: string | null} = {[TestEnum.A]: "AAA"};
    // Item here is strict "string" type, no undefined
    expect(ObjectUtil.toArray(fullMap, (key, item) => (item === null ? "NULL" : item.toLowerCase()))).toEqual(["aaa", "bbb", "NULL"]);
    expect(ObjectUtil.toArray(partialMap, (key, item) => (item === null ? "NULL" : item.toLowerCase()))).toEqual(["aaa"]);
});

test("Check Is Empty", () => {
    expect(ObjectUtil.isEmpty({})).toBe(true);
    expect(ObjectUtil.isEmpty({a: 1})).toBe(false);
});

test("Find Key", () => {
    const obj = {a: 1, b: "1", c: "a", d: [1, 2, 3], e: undefined};
    expect(ObjectUtil.findKey({a: 1}, 2)).toBe(null);
    expect(ObjectUtil.findKey(obj, 1)).toBe("a");
    expect(ObjectUtil.findKey(obj, obj["d"])).toBe("d");
    expect(ObjectUtil.findKey(obj, [1, 2, 3])).toBe(null);
    // @ts-expect-error
    ObjectUtil.findKey(obj, undefined);
});

test("Deep Clone With Cycle", () => {
    const obj: {[key: string]: any} = {a: 1, b: []};
    obj.c = obj;
    expect(() => ObjectUtil.deepClone(obj)).toThrow();
});

test("Deep Clone (Object)", () => {
    const date = new Date();
    const fn = () => {};
    const object = {
        a: {a1: 12},
        b: ["x", "y", "z"],
        c: date,
        d: fn,
        e: true,
        f: null,
        g: undefined,
        h: 100,
    };

    expect(ObjectUtil.deepClone(object)).toEqual(object);

    const clonedObject = ObjectUtil.deepClone(object);
    object.a.a1 = 14;
    clonedObject.a.a1 = 13;
    object.b[0] = "X";
    clonedObject.b[0] = "*";
    clonedObject.e = false;
    clonedObject.h = 99;
    expect(object.a.a1).toBe(14);
    expect(clonedObject.a.a1).toBe(13);
    expect(object.b).toEqual(["X", "y", "z"]);
    expect(clonedObject.b).toEqual(["*", "y", "z"]);
    expect(clonedObject.c !== date).toBe(true);
    expect(clonedObject.c.getTime()).toBe(date.getTime());
    expect(clonedObject.d === fn).toBe(true);
    expect(typeof clonedObject.d).toBe("function");
    expect(object.e).toBe(true);
    expect(clonedObject.e).toBe(false);
    expect(clonedObject.f).toBeNull();
    expect(clonedObject.g).toBeUndefined();
    expect(object.h).toBe(100);
    expect(clonedObject.h).toBe(99);
});

test("Deep Clone (Array)", () => {
    const list = [{v: 10}, {v: 11}, {v: 12}];
    expect(ObjectUtil.deepClone(list)).toEqual(list);

    const clonedList = ObjectUtil.deepClone(list);
    clonedList[0].v = 20;
    expect(list[0].v).toEqual(10);
    expect(clonedList[0].v).toEqual(20);
});

test("Sort by keys", () => {
    const object = {b: "5", a: {a1: ["2", "1", "5"], a2: {name: "test", id: "20200201"}}, d: 25, c: [1, 5, 4, 3]};
    let sortedObject = ObjectUtil.sortByKeys(object, ["a", "b", "c", "d"]);
    expect(Object.keys(sortedObject)).toEqual(["a", "b", "c", "d"]);
    expect(sortedObject).toEqual(object);
    sortedObject = ObjectUtil.sortByKeys(object, ["d", "b", "c", "a"]);
    expect(Object.keys(sortedObject)).toEqual(["d", "b", "c", "a"]);
    expect(sortedObject).toEqual(object);
    sortedObject = ObjectUtil.sortByKeys(object, ["a", "b"]);
    expect(Object.keys(sortedObject)).toEqual(["a", "b", "d", "c"]);
    expect(sortedObject).toEqual(object);
    sortedObject = ObjectUtil.sortByKeys(object, ["d", "a", "c"]);
    expect(Object.keys(sortedObject)).toEqual(["d", "a", "c", "b"]);
    expect(sortedObject).toEqual(object);
});
