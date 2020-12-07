import {ArrayUtil} from "../../src/core/ArrayUtil";

describe("ArrayUtil.sum", () => {
    type TestEachRowSchema = {input: number[]; expected: number};
    test.each`
        input                    | expected
        ${[]}                    | ${0}
        ${[5]}                   | ${5}
        ${[1, 2, 3]}             | ${6}
        ${[-1, 1, 2, 0]}         | ${2}
        ${[-1, 1, 2, 0, 10, 10]} | ${22}
    `("returns $expected with input $input", ({input, expected}: TestEachRowSchema) => {
        expect(ArrayUtil.sum(input)).toBe(expected);
    });
});

describe("ArrayUtil.sumByKey", () => {
    type TestEachRowSchema = {input: Record<string, unknown>[]; key: string; expected: number};
    test.each`
        input                                   | key      | expected
        ${[]}                                   | ${"nvm"} | ${0}
        ${[{a: 10}]}                            | ${"a"}   | ${10}
        ${[{a: 10, b: ""}, {a: 22, b: ""}]}     | ${"a"}   | ${32}
        ${[{a: "10", b: ""}, {a: "22", b: ""}]} | ${"a"}   | ${32}
        ${[{a: 10, b: ""}, {b: ""}]}            | ${"a"}   | ${10}
        ${[{a: 10, b: ""}, {b: 100}, {b: {}}]}  | ${"b"}   | ${100}
    `("returns $expected with sum by key $key of [...]", ({input, key, expected}: TestEachRowSchema) => {
        expect(ArrayUtil.sumByKey(input as any[], key)).toBe(expected);
    });
});

describe("ArrayUtil.toggleElement", () => {
    type TestEachRowSchema = {element: number; expected: number[]};
    test.each`
        element | expected
        ${4}    | ${[1, 2, 3, 5, 6]}
        ${10}   | ${[1, 2, 3, 4, 5, 6, 10]}
        ${6}    | ${[1, 2, 3, 4, 5]}
        ${1}    | ${[2, 3, 4, 5, 6]}
    `("toggle $element on [1...6] returns $expected", ({element, expected}: TestEachRowSchema) => {
        const array = [1, 2, 3, 4, 5, 6];
        expect(ArrayUtil.toggleElement(array, element)).toStrictEqual(expected);
    });

    test("toggle 0 on [] returns [0]", () => {
        expect(ArrayUtil.toggleElement([], 0)).toStrictEqual([0]);
    });
});

describe("ArrayUtil.areSame", () => {
    describe.each([
        [1, 2, 3, 4, 5, 6],
        [2, 3, 1, 6, 5, 4],
    ])("array %o", (...array: number[]) => {
        test("same as another array with same elements (always)", () => {
            const arrayClone: number[] = JSON.parse(JSON.stringify(array));
            expect(arrayClone).toBeInstanceOf(Array), expect(arrayClone).not.toBe(array); // different reference
            expect(ArrayUtil.areSame(array, arrayClone, true)).toBe(true);
            expect(ArrayUtil.areSame(array, arrayClone, false)).toBe(true);
        });

        test("same as another array with different order with compareOrdering false", () => {
            const compareOrdering = false;
            const arrayClone: number[] = JSON.parse(JSON.stringify(array));
            expect(arrayClone).toBeInstanceOf(Array), expect(arrayClone).not.toBe(array); // different reference
            arrayClone.reverse();
            expect(ArrayUtil.areSame(array, arrayClone, compareOrdering)).toBe(true);
        });

        test("not same as another array with different order with compareOrdering true", () => {
            const compareOrdering = true;
            const arrayClone: number[] = JSON.parse(JSON.stringify(array));
            expect(arrayClone).toBeInstanceOf(Array), expect(arrayClone).not.toBe(array); // different reference
            arrayClone.reverse();
            expect(ArrayUtil.areSame(array, arrayClone, compareOrdering)).toBe(false);
        });

        test.each([
            // All are different from array
            [2, 3, 1, 6, 5],
            [2, 3, 2, 6, 5, 1],
            [1, 2, 3, 4, 5, 6, 7],
            [1, 2, 3, 4, 5, 6, 6],
            [],
        ])("not same as %o", (...differentArray: number[]) => {
            expect(ArrayUtil.areSame(array, differentArray, true)).toBe(false);
            expect(ArrayUtil.areSame(array, differentArray, false)).toBe(false);
        });
    });
});

describe("ArrayUtil.sortBy", () => {
    describe("by number", () => {
        const sortedList = [10, 20, 30, 40, 50];
        const extraList1 = [50, 30, 20];
        const extraList2 = [20, 30, 10];
        const extraList3 = [10, 50, 2];

        type TestEachRowSchema = {array: any[]; extraPriorityLists: any[][]; expected: any[]};
        test.each`
            array                     | extraPriorityLists                      | expected
            ${[]}                     | ${[]}                                   | ${[]}
            ${[2]}                    | ${[]}                                   | ${[2]}
            ${[2, 3]}                 | ${[]}                                   | ${[2, 3]}
            ${[30, 2, 50, 1]}         | ${[]}                                   | ${[30, 50, 2, 1]}
            ${[50, 3, 2, 20, 9, -1]}  | ${[]}                                   | ${[20, 50, 3, 2, 9, -1]}
            ${[50, 3, 2, 20, 9, -1]}  | ${[extraList1]}                         | ${[50, 20, 3, 2, 9, -1]}
            ${[50, 3, 2, 20, 9, -1]}  | ${[extraList1, extraList2]}             | ${[20, 50, 3, 2, 9, -1]}
            ${[10, 20]}               | ${[]}                                   | ${[10, 20]}
            ${[30, 20]}               | ${[]}                                   | ${[20, 30]}
            ${[30, 20, 50, 10]}       | ${[]}                                   | ${[10, 20, 30, 50]}
            ${[20, 20, 50, 10]}       | ${[]}                                   | ${[10, 20, 20, 50]}
            ${[20, 20, 50, 10]}       | ${[extraList1]}                         | ${[50, 20, 20, 10]}
            ${[20, 20, 50, 10]}       | ${[extraList1, extraList2]}             | ${[20, 20, 10, 50]}
            ${[20, 20, 50, 10]}       | ${[extraList2, extraList1]}             | ${[50, 20, 20, 10]}
            ${[20, 20, 50, 10]}       | ${[extraList1, extraList2, extraList3]} | ${[10, 50, 20, 20]}
            ${[10, 50, 20, 30]}       | ${[extraList1]}                         | ${[50, 30, 20, 10]}
            ${[10, 50, 20, 30]}       | ${[extraList1, extraList2]}             | ${[20, 30, 10, 50]}
            ${[2, 10, 50, 20, 30]}    | ${[extraList1, extraList2, extraList3]} | ${[10, 50, 2, 20, 30]}
            ${[2, 2, 10, 50, 20, 30]} | ${[extraList1, extraList2, extraList3]} | ${[10, 50, 2, 2, 20, 30]}
        `("returns expected array from sortBy($array) @testid:$_id", ({array, extraPriorityLists, expected}: TestEachRowSchema) => {
            expect(ArrayUtil.sortBy(array, sortedList, ...extraPriorityLists)).toStrictEqual(expected);
        });
    });

    describe("by string enum", () => {
        enum Enum {
            A = "A",
            B = "B",
            C = "C",
            D = "D",
            E = "E",
        }

        const sortedList = [Enum.A, Enum.B, Enum.C, Enum.D, Enum.E];

        type TestEachRowSchema = {array: Enum[]; expected: Enum[]};

        test.each`
            array                                               | expected
            ${[]}                                               | ${[]}
            ${sortedList}                                       | ${sortedList}
            ${[Enum.B]}                                         | ${[Enum.B]}
            ${[Enum.A, Enum.A, Enum.B]}                         | ${[Enum.A, Enum.A, Enum.B]}
            ${[Enum.E, Enum.D, Enum.A]}                         | ${[Enum.A, Enum.D, Enum.E]}
            ${[Enum.D, Enum.A, Enum.B, Enum.B, Enum.A, Enum.C]} | ${[Enum.A, Enum.A, Enum.B, Enum.B, Enum.C, Enum.D]}
        `("returns expected array from sortBy($array, sortedList)", ({array, expected}: TestEachRowSchema) => {
            expect(ArrayUtil.sortBy(array, sortedList)).toStrictEqual(expected);
        });
    });
});

describe("ArrayUtil.chunk", () => {
    const array: ReadonlyArray<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    describe("by shape", () => {
        test("throws if sum of shape elements total does not equal array length", () => {
            expect(() => ArrayUtil.chunk(array, [1, 2])).toThrow();
            expect(() => ArrayUtil.chunk(array, [100, 200])).toThrow();
        });

        test("throws if shape elements includes non-integer or negative numbers", () => {
            expect(() => ArrayUtil.chunk(array, [-1, 10])).toThrow();
            expect(() => ArrayUtil.chunk(array, [0.9, 8.1])).toThrow();
        });

        type TestEachRowSchema = {shape: number[]; expected: number[][]};
        test.each`
            shape           | expected
            ${[0, 0, 9]}    | ${[[], [], array]}
            ${[1, 3, 2, 3]} | ${[[1], [2, 3, 4], [5, 6], [7, 8, 9]]}
            ${[3, 3, 3]}    | ${[[1, 2, 3], [4, 5, 6], [7, 8, 9]]}
            ${[6, 1, 2]}    | ${[[1, 2, 3, 4, 5, 6], [7], [8, 9]]}
        `("return expected chunks when shape is $shape", ({shape, expected}: TestEachRowSchema) => {
            expect(ArrayUtil.chunk(array, shape)).toStrictEqual(expected);
        });
    });

    describe("by size", () => {
        test("throws if size is non-integer or is non-positive number", () => {
            expect(() => ArrayUtil.chunk(array, 0)).toThrow();
            expect(() => ArrayUtil.chunk(array, 2.2)).toThrow();
            expect(() => ArrayUtil.chunk(array, NaN)).toThrow();
        });

        type TestEachRowSchema = {size: number; expected: number[][]};
        test.each`
            size  | expected
            ${1}  | ${[[1], [2], [3], [4], [5], [6], [7], [8], [9]]}
            ${2}  | ${[[1, 2], [3, 4], [5, 6], [7, 8], [9]]}
            ${3}  | ${[[1, 2, 3], [4, 5, 6], [7, 8, 9]]}
            ${4}  | ${[[1, 2, 3, 4], [5, 6, 7, 8], [9]]}
            ${5}  | ${[[1, 2, 3, 4, 5], [6, 7, 8, 9]]}
            ${6}  | ${[[1, 2, 3, 4, 5, 6], [7, 8, 9]]}
            ${7}  | ${[[1, 2, 3, 4, 5, 6, 7], [8, 9]]}
            ${8}  | ${[[1, 2, 3, 4, 5, 6, 7, 8], [9]]}
            ${9}  | ${[[1, 2, 3, 4, 5, 6, 7, 8, 9]]}
            ${10} | ${[[1, 2, 3, 4, 5, 6, 7, 8, 9]]}
            ${11} | ${[[1, 2, 3, 4, 5, 6, 7, 8, 9]]}
        `("return expected chunks when size is $size", ({size, expected}: TestEachRowSchema) => {
            expect(ArrayUtil.chunk(array, size)).toStrictEqual(expected);
        });
    });
});

describe("ArrayUtil.generate", () => {
    type TestEachRowSchema = {cnt: number; generator: any; expected: any[]};

    test.each`
        cnt  | generator       | expected
        ${0} | ${{}}           | ${[]}
        ${2} | ${{}}           | ${[{}, {}]}
        ${0} | ${{a: 1, b: 2}} | ${[]}
        ${2} | ${{a: 1, b: 2}} | ${[{a: 1, b: 2}, {a: 1, b: 2}]}
    `("returns expected array from generate($cnt, <static-value>)", ({cnt, generator, expected}: TestEachRowSchema) => {
        expect(ArrayUtil.generate(cnt, generator)).toStrictEqual(expected);
    });

    test.each`
        cnt  | generator                          | expected
        ${0} | ${(index: number) => ({a: index})} | ${[]}
        ${2} | ${(index: number) => ({a: index})} | ${[{a: 0}, {a: 1}]}
    `("returns expected array from generate($cnt, <function>)", ({cnt, generator, expected}: TestEachRowSchema) => {
        expect(ArrayUtil.generate(cnt, generator)).toStrictEqual(expected);
    });
});

describe("ArrayUtil.toObject", () => {
    type MapperCallback = (item: any, index: number) => [string, any];
    type TestEachRowSchema = {array: any[]; mapperCallback: MapperCallback; expected: object};
    test.each`
        _id  | array               | mapperCallback                                                       | expected
        ${0} | ${[]}               | ${((item, index) => [index.toString(), item]) as MapperCallback}     | ${{}}
        ${1} | ${[1, 2, "a", "b"]} | ${((item, index) => [index.toString(), item]) as MapperCallback}     | ${{0: 1, 1: 2, 2: "a", 3: "b"}}
        ${2} | ${[1, 2, "a", "b"]} | ${((item, index) => [item.toString(), index]) as MapperCallback}     | ${{1: 0, 2: 1, a: 2, b: 3}}
        ${3} | ${[1, 2, "a", "b"]} | ${((item, index) => [item.toString(), {a: item}]) as MapperCallback} | ${{1: {a: 1}, 2: {a: 2}, a: {a: "a"}, b: {a: "b"}}}
    `("returns expected array from toObject() @testid:$_id", ({array, mapperCallback, expected}: TestEachRowSchema) => {
        expect(ArrayUtil.toObject(array, mapperCallback)).toStrictEqual(expected);
    });

    test("returns expected array from toObject() with mapperCallback referencing array", () => {
        const array = [1, 2, "a", "b"];
        const expected = {b: 1, a: 2, 2: "a", 1: "b"};
        const result = ArrayUtil.toObject(array, (item, index) => [array[array.length - index - 1].toString(), item]);
        expect(result).toStrictEqual(expected);
    });
});

describe("ArrayUtil.hasIntersection", () => {
    const obj = {same: "reference"};

    type TestEachRowSchema = {a: number[]; b: number[]; expected: boolean};
    // prettier-ignore
    test.each`
        a           | b           | expected
        ${[1, 2]}   | ${[2, 3]}   | ${true}      (number 2 intersects)
        ${[]}       | ${[2, 3]}   | ${false}     (empty array does not intersect)
        ${[1, 2]}   | ${[]}       | ${false}     (empty array does not intersect)
        ${[1, 2]}   | ${[3, 4]}   | ${false}     (no intersect)
        ${[{a: 1}]} | ${[{a: 1}]} | ${false}     (does not do deep comparison)
        ${[obj]}    | ${[obj]}    | ${true}      (obj has same reference -> shallow comparison returns true)
        ${[obj, 1]} | ${[obj]}    | ${true}
        ${[obj]}    | ${[obj, 1]} | ${true}
    `("returns $expected for $a and $b", ({a, b, expected}: TestEachRowSchema) => {
        expect(ArrayUtil.hasIntersection(a, b)).toBe(expected);
    });
});

describe("ArrayUtil.compactMap", () => {
    test("happy path tests", () => {
        expect.assertions(4);
        const createTest = (_: {arrayInp: any[]; callback: (..._: any[]) => any; expected: any[]}) => ({
            run: () => expect(ArrayUtil.compactMap(_.arrayInp, _.callback)).toStrictEqual(_.expected),
        });
        createTest({
            arrayInp: [],
            callback: _ => _,
            expected: [],
        }).run();
        createTest({
            arrayInp: [1, 2, 3, 0, 8],
            callback: (_: number) => _ * 2,
            expected: [2, 4, 6, 0, 16],
        }).run();
        createTest({
            arrayInp: ["a", "b", "cdefg"],
            callback: (_: string) => _.toUpperCase(),
            expected: ["A", "B", "CDEFG"],
        }).run();
        createTest({
            arrayInp: [{p: 1}, {p: 2}, {p: 3}],
            callback: _ => _.p,
            expected: [1, 2, 3],
        }).run();
    });

    test("do nothing with empty array", () => {
        const mockFn = jest.fn().mockImplementation(() => {
            throw new Error("ArrayUtil.compactMap callback should not be called with empty array");
        });
        const result = ArrayUtil.compactMap([], mockFn);
        expect(result).toStrictEqual([]);
        expect(mockFn).not.toHaveBeenCalled();
    });

    test("removes undefined, null, NaN from array (identity callback)", () => {
        expect.assertions(4);
        const identityFn = (_: any) => _;
        const createTest = (arrayInput: any[]) => ({
            run: () => expect(ArrayUtil.compactMap(arrayInput, identityFn)).toStrictEqual(["a", 1, true]),
        });
        createTest([undefined, "a", 1, true]).run();
        createTest(["a", null, 1, true]).run();
        createTest(["a", 1, NaN, true, NaN]).run();
        createTest([NaN, null, "a", 1, undefined, true]).run();
    });

    test("does not remove falsy values other than undefined, null, NaN from array (identity callback)", () => {
        expect.assertions(2);
        const identityFn = (_: any) => _;
        const createTest = (arrayInput: any[]) => ({
            run: () => expect(ArrayUtil.compactMap(arrayInput, identityFn)).toStrictEqual(["", 0, false]),
        });
        createTest(["", 0, false]).run();
        createTest([NaN, null, "", 0, undefined, false]).run();
    });

    test("does not remove anything before mapping", () => {
        expect.assertions(2);
        const mapToTrue = (_: any) => true;
        const createTest = (arrayInput: any[]) => ({
            run: () => expect(ArrayUtil.compactMap(arrayInput, mapToTrue)).toStrictEqual(arrayInput.map(() => true)),
        });
        createTest([undefined, null, NaN]).run();
        createTest([NaN, null, "a", 1, undefined, true, function f() {}]).run();
    });

    test("only removes undefined, null, NaN from array after mapping (get property callback)", () => {
        expect.assertions(2);
        const getP = <T>(_: {p: T}) => _.p;
        const createTest = (_: {arrayInp: Array<{p: any}>; expected: Array<any>}) => ({
            run: () => expect(ArrayUtil.compactMap(_.arrayInp, getP)).toStrictEqual(_.expected),
        });
        createTest({
            arrayInp: [{p: "a"}, {p: 1}, {p: true}],
            expected: ["a", 1, true],
        }).run();
        createTest({
            arrayInp: [{p: NaN}, {p: null}, {p: "a"}, {p: 1}, {p: undefined}, {p: true}],
            expected: ["a", 1, true],
        }).run();
    });

    test("only removes undefined, null, NaN from array after mapping (complex computation callback)", () => {
        expect.assertions(4);
        const createTest = (_: {arrayInp: any[]; callback: (..._: any[]) => any; expected: any[]}) => ({
            run: () => expect(ArrayUtil.compactMap(_.arrayInp, _.callback)).toStrictEqual(_.expected),
        });
        createTest({
            arrayInp: ["1", "2", "3", "not-a-number", "also-not-a-number"],
            callback: Number,
            expected: [1, 2, 3],
        }).run();
        createTest({
            arrayInp: ["0.5", "1.5", "2.5", "not-a-number", "also-not-a-number"],
            callback: _ => Math.round(parseFloat(_) * 2),
            expected: [1, 3, 5],
        }).run();
        createTest({
            arrayInp: ["", "short", "very loooooooooooooooooooooooooooooooooooooooooooooooooooooong"],
            callback: (_: string) => _.slice(10, 15).toUpperCase(),
            expected: ["", "", "OOOOO"],
        }).run();
        createTest({
            arrayInp: [{name: "A"}, {name: "B"}, {name: "AB"}],
            callback: _ => (_.name.length > 1 ? null : {foo: _.name.toLowerCase()}),
            expected: [{foo: "a"}, {foo: "b"}],
        }).run();
    });
});
