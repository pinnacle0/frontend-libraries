/* eslint-disable @typescript-eslint/no-unused-vars -- test type */
import type {
    ArrayElement,
    KeysOfType,
    NonNullableKeys,
    NullableKeys,
    PickNonNullable,
    PickOptional,
    MarkAsRequired,
    MarkAsOptional,
    MarkAsNullable,
    MarkAsNonNullable,
    StrictRequired,
} from "../src/type";

describe("KeysOfType<T, ExpectedValueType>", () => {
    type T = {
        a1: string;
        a2: number;
        a3: boolean;
        a4: {nested1: string; nested2: number};
        b1: string;
        b2: number;
        b3: boolean;
        b4: {nested1: string};
        c: undefined;
        d: null;
    };

    // Use the Record utility type for test instead of using:
    // `let t1: KeysOfType<T, string>; t1 = "a1"; t2 = "a2";`
    // Since the above test does not report error if `t2 = "a2";` is missing.
    //
    // By using a Record utility type, all keys assignable must be included in
    // the object literal declared with KeysOfType<T, string> or an error will be thrown.
    test("should give the correct union of keys", () => {
        type Test1 = KeysOfType<T, string>;
        const t1: Record<Test1, 1> = {a1: 1, b1: 1};

        type Test2 = KeysOfType<T, number>;
        const t2: Record<Test2, 2> = {a2: 2, b2: 2};

        type Test3 = KeysOfType<T, boolean>;
        const t3: Record<Test3, 3> = {a3: 3, b3: 3};

        type Test4 = KeysOfType<T, object>;
        const t4: Record<Test4, 4> = {a4: 4, b4: 4};

        type Test4_1 = KeysOfType<T, {nested1: string; nested2: number}>;
        const t4_1: Record<Test4_1, 4> = {a4: 4};

        type Test4_2 = KeysOfType<T, {nested1: string}>;
        const t4_2: Record<Test4_2, 4> = {a4: 4, b4: 4};

        type Test5 = KeysOfType<T, Array<any>>;
        const t5: Record<Test5, 5> = {};

        type Test6 = KeysOfType<T, {}>;
        const t6: Record<Test6, 6> = {
            a1: 6,
            a2: 6,
            a3: 6,
            a4: 6,
            b1: 6,
            b2: 6,
            b3: 6,
            b4: 6,
        };

        type Test7 = KeysOfType<T, any>;
        const t7: Record<Test7, 7> = {
            a1: 7,
            a2: 7,
            a3: 7,
            a4: 7,
            b1: 7,
            b2: 7,
            b3: 7,
            b4: 7,
            c: 7,
            d: 7,
        };
    });

    test("should throw a type error when assigned with incompatible value", () => {
        let t1: KeysOfType<T, string>;
        // @ts-expect-error
        t1 = "a2";
        // @ts-expect-error
        t1 = "a3";
        // @ts-expect-error
        t1 = "a4";
        // @ts-expect-error
        t1 = "b2";
        // @ts-expect-error
        t1 = "b3";
        // @ts-expect-error
        t1 = "b4";

        let t4_2: KeysOfType<T, {nested1: string}>;
        // @ts-expect-error
        t4_2 = "a1";
        // @ts-expect-error
        t4_2 = "a2";
        // @ts-expect-error
        t4_2 = "a3";
        // @ts-expect-error
        t4_2 = "b1";
        // @ts-expect-error
        t4_2 = "b2";
        // @ts-expect-error
        t4_2 = "b3";
    });
});

describe("ArrayElement<ArrayType extends readonly unknown[]>", () => {
    // Note: use `as const` here to let typescript narrow the type
    const tuple1 = [1, "b", true, {d: 0}] as const;
    type Tuple1 = typeof tuple1;

    test("should be assignable by the type of elements of ArrayType", () => {
        let t1: ArrayElement<Tuple1>;
        t1 = 1;
        t1 = "b";
        t1 = true;
        t1 = {d: 0};

        let t2: ArrayElement<number[]>;
        t2 = 0;
        t2 = 1;
        t2 = -999;
        t2 = Number.MAX_SAFE_INTEGER;
        t2 = Number.NEGATIVE_INFINITY;

        let t3: ArrayElement<ReadonlyArray<{foo: string}>>;
        t3 = {foo: "bar"};
        t3 = {foo: "baz"};
        const t3_temp = {
            foo: "baz",
            note: `
            Assigning "t3_temp" to "t3" should pass because this extra property "note" is
            added to the object when t3_temp is declared, and because this object is not
            assigned to "t3" as an object literal, the extra property checking is not triggered.
            `,
        };
        t3 = t3_temp;
    });

    test("should not be assignable by types other the type of elements of ArrayType", () => {
        let t1: ArrayElement<Tuple1>;
        // @ts-expect-error
        t1 = 2;
        // @ts-expect-error
        t1 = "c";
        // @ts-expect-error
        t1 = false;
        // @ts-expect-error
        t1 = {d: 1};

        let t2: ArrayElement<number[]>;
        // @ts-expect-error
        t2 = false;
        // @ts-expect-error
        t2 = "daz";

        let t3: ArrayElement<ReadonlyArray<{foo: string}>>;
        // @ts-expect-error
        t3 = {foo: 1};
        // @ts-expect-error
        t3 = {foo: false};
        // @ts-expect-error
        t3 = {foo: "baz", note: 'Assigning an object literal to "t3" triggers the extra property check so this should fail'};
    });
});

describe("MarkAsRequired", () => {
    type TestType = {
        zoo: number;
        cow: string;
        foo?: string;
        bar?: number | undefined;
    };

    test("foo and bar are required", () => {
        let x: MarkAsRequired<TestType, "foo" | "bar">;

        x = {zoo: 10, cow: "st", foo: "21", bar: 5};
        // @ts-expect-error
        x = {zoo: 5, cow: "test"};
        // @ts-expect-error
        x = {zoo: 5, cow: "test", foo: "sad"};
        // @ts-expect-error
        x = {zoo: 5, cow: "test", foo: "sad", bar: "test"};
        // @ts-expect-error
        x = {zoo: 5, cow: "test", foo: 10, bar: 5};
    });

    test("foo and cow are required", () => {
        let x: MarkAsRequired<TestType, "foo" | "cow">;

        x = {zoo: 10, cow: "st", foo: "21", bar: 5};
        x = {zoo: 10, cow: "st", foo: "21"};
        // @ts-expect-error
        x = {zoo: 10, cow: "5"};
        // @ts-expect-error
        x = {zoo: 10, bar: 5};
        // @ts-expect-error
        x = {zoo: 10, foo: "21"};
        // @ts-expect-error
        x = {zoo: 10, foo: "21", bar: 5, cow: 5};
        x = {zoo: 10, foo: "5", cow: "test"};
    });
});

describe("PickOptional", () => {
    type TestType = {
        nonNullable: 10;
        anotherNonNullable: 10;
        canBeUndefined: 11 | undefined;
        canBeNull: 12 | null;
        canBeNullAndUndefined: 13 | null | undefined;

        optionalNonNullable?: 20;
        optionalCanBeUndefined?: 21 | undefined;
        optionalCanBeNull?: 22 | null;
        optionalCanBeNullAndUndefined?: 23 | null | undefined;
    };

    let t1: PickOptional<TestType>;

    test("should include only properties from T with keys that are optional", () => {
        t1 = {
            optionalNonNullable: 20,
            optionalCanBeUndefined: 21,
            optionalCanBeNull: 22,
            optionalCanBeNullAndUndefined: 23,
        };
    });

    test("should allow omitting from T with keys that are optional", () => {
        t1 = {optionalNonNullable: 20};
        t1 = {optionalCanBeNullAndUndefined: 23};
        t1 = {optionalCanBeUndefined: 21, optionalCanBeNull: 22, optionalCanBeNullAndUndefined: 23};
        t1 = {};
    });

    test("should not include any property from T with values with types not assignable to null and undefined", () => {
        // @ts-expect-error
        t1 = {optionalCanBeNullAndUndefined: 23, nonNullable: 10, anotherNonNullable: 10};
        // @ts-expect-error
        t1 = {nonNullable: 10, anotherNonNullable: 10};
    });
});

describe("PickNonNullable", () => {
    type TestType = {
        nonNullable: 10;
        anotherNonNullable: 10;
        canBeUndefined: 11 | undefined;
        canBeNull: 12 | null;
        canBeNullAndUndefined: 13 | null | undefined;

        optionalNonNullable?: 20;
        optionalCanBeUndefined?: 21 | undefined;
        optionalCanBeNull?: 22 | null;
        optionalCanBeNullAndUndefined?: 23 | null | undefined;
    };

    let t1: PickNonNullable<TestType>;

    test("should include only properties from T with values with types not assignable to null and undefined", () => {
        t1 = {nonNullable: 10, anotherNonNullable: 10};
    });

    test("should not omit any property from T with values with types not assignable to null and undefined", () => {
        // @ts-expect-error
        t1 = {nonNullable: 10};
        // @ts-expect-error
        t1 = {anotherNonNullable: 10};
        // @ts-expect-error
        t1 = {};
    });

    test("should not include any property from T with values with types assignable to null and undefined", () => {
        // @ts-expect-error
        t1 = {nonNullable: 10, anotherNonNullable: 10, canBeUndefined: 11, canBeNull: 12};
        // @ts-expect-error
        t1 = {nonNullable: 10, anotherNonNullable: 10, optionalNonNullable: 20};
        // @ts-expect-error
        t1 = {nonNullable: 10, anotherNonNullable: 10, optionalCanBeNullAndUndefined: 23};
    });
});

describe("NullableKeys", () => {
    type TestType = {
        nonNullable: 10;
        canBeUndefined: 11 | undefined;
        canBeNull: 12 | null;
        canBeNullAndUndefined: 13 | null | undefined;

        optionalNonNullable?: 20;
        optionalCanBeUndefined?: 21 | undefined;
        optionalCanBeNull?: 22 | null;
        optionalCanBeNullAndUndefined?: 23 | null | undefined;
    };

    let t1: NullableKeys<TestType>;

    test("should return union of keys that correspond to values with types assignable to null and undefined", () => {
        t1 = "canBeUndefined";
        t1 = "canBeNull";
        t1 = "canBeNullAndUndefined";

        t1 = "optionalNonNullable";
        t1 = "optionalCanBeUndefined";
        t1 = "optionalCanBeNull";
        t1 = "optionalCanBeNullAndUndefined";
    });

    test("should not be assignable by keys that correspond to values with types not assignable to null and undefined", () => {
        // @ts-expect-error
        t1 = "nonNullable";
    });
});

describe("NonNullableKeys", () => {
    type TestType = {
        nonNullable: 10;
        canBeUndefined: 11 | undefined;
        canBeNull: 12 | null;
        canBeNullAndUndefined: 13 | null | undefined;

        optionalNonNullable?: 20;
        optionalCanBeUndefined?: 21 | undefined;
        optionalCanBeNull?: 22 | null;
        optionalCanBeNullAndUndefined?: 23 | null | undefined;
    };

    let t1: NonNullableKeys<TestType>;

    test("should return union of keys that correspond to values with types not assignable to null and undefined", () => {
        t1 = "nonNullable";
    });

    test("should not be assignable by keys that correspond to values with types assignable to null and undefined", () => {
        // @ts-expect-error
        t1 = "canBeUndefined";
        // @ts-expect-error
        t1 = "canBeNull";
        // @ts-expect-error
        t1 = "canBeNullAndUndefined";
        // @ts-expect-error
        t1 = "optionalNonNullable";
        // @ts-expect-error
        t1 = "optionalCanBeUndefined";
        // @ts-expect-error
        t1 = "optionalCanBeNull";
        // @ts-expect-error
        t1 = "optionalCanBeNullAndUndefined";
    });
});

describe("MarkAsNonNullable", () => {
    type TestType = {
        a: number;
        b: string | null;
        c: string[];
    };

    test("zoo and cow are Nullable", () => {
        let x: MarkAsNonNullable<TestType, "a" | "b">;

        x = {a: 1, b: "b", c: ["c"]};

        // @ts-expect-error
        x = {a: null, b: "b", c: ["c"]};
        // @ts-expect-error
        x = {a: 1, b: null, c: ["c"]};
        // @ts-expect-error
        x = {a: null, b: null, c: ["c"]};
        // @ts-expect-error
        x = {a: 1, b: "b", c: null};
    });
});

describe("MarkAsOptional", () => {
    type TestType = {
        zoo: number;
        cow: string;
        cat?: string;
        foo: string;
    };

    test("zoo and cow are optional", () => {
        let x: MarkAsOptional<TestType, "zoo" | "cow">;

        x = {foo: "foo"};
        // @ts-expect-error
        x = {foo: "foo", zoo: 100, cow: 100};

        x = {foo: "foo", cat: "cat", zoo: 10};
        // @ts-expect-error
        x = {zoo: 10};
        // @ts-expect-error
        x = {};
    });

    test("cat is optional", () => {
        let x: MarkAsOptional<TestType, "cat">;

        x = {zoo: 10, cow: "cow", foo: "foo"};
        // @ts-expect-error
        x = {zoo: 10, cow: "cow", foo: "foo", cat: 100};
        // @ts-expect-error
        x = {zoo: "zoo"};
        // @ts-expect-error
        x = {foo: "foo"};
    });
});

describe("MarkAsNullable", () => {
    type TestType = {
        zoo: number;
        cow: string;
        cat: string | null;
        foo: string;
    };

    test("zoo and cow are Nullable", () => {
        let x: MarkAsNullable<TestType, "zoo" | "cow">;

        x = {foo: "foo", zoo: null, cow: "cow", cat: null};

        x = {foo: "foo", zoo: null, cow: null, cat: "cat"};
        // @ts-expect-error
        x = {foo: "foo", zoo: 100, cow: 10};

        // @ts-expect-error
        x = {foo: "foo", cat: "cat", zoo: 10};
        // @ts-expect-error
        x = {zoo: 10};
        // @ts-expect-error
        x = {};
    });

    test("cat is Nullable", () => {
        let x: MarkAsNullable<TestType, "cat">;

        x = {zoo: 10, cow: "cow", foo: "foo", cat: null};
        // @ts-expect-error
        x = {zoo: 10, cow: "cow", foo: "foo"};
        // @ts-expect-error
        x = {zoo: 10, cow: "cow", foo: "foo", cat: 100};
        // @ts-expect-error
        x = {zoo: "zoo"};
        // @ts-expect-error
        x = {foo: "foo"};
    });
});

describe("StrictRequired<T>", () => {
    type TestType = {
        normal: number;
        nullable: number | null;
        undefinable: number | undefined;
        optional?: number;
        optionalAndNullable?: number | null;
        allTogether?: number | undefined | null;
    };

    test("All keys are required and removed null | undefined", () => {
        let test: StrictRequired<TestType>;

        // Correct Pass
        test = {
            normal: 0,
            nullable: 0,
            undefinable: 0,
            optional: 0,
            optionalAndNullable: 0,
            allTogether: 0,
        };

        // default type are remain the same
        test = {
            // @ts-expect-error
            normal: null,
            nullable: 0,
            undefinable: 0,
            optional: 0,
            optionalAndNullable: 0,
            allTogether: 0,
        };

        // No Optionals allowed
        // @ts-expect-error
        test = {
            normal: 0,
            nullable: 0,
            undefinable: 0,
        };

        // No Nullable allowed
        test = {
            normal: 0,
            // @ts-expect-error
            nullable: null,
            undefinable: 0,
            optional: 0,
            // @ts-expect-error
            optionalAndNullable: null,
            // @ts-expect-error
            allTogether: null,
        };

        // No Undefinable allowed
        test = {
            normal: 0,
            nullable: 0,
            // @ts-expect-error
            undefinable: undefined,
            optional: 0,
            optionalAndNullable: 0,
            // @ts-expect-error
            allTogether: undefined,
        };
    });
});
