import {Memo} from "../../src/decorator/Memo";

test("@Memo", () => {
    const mock = jest.fn();
    class Person {
        constructor(private name: string, private age: number) {}
        @Memo
        getName(...args: any[]) {
            mock();
            return {args, name: this.name};
        }

        @Memo
        getAge(...args: any[]) {
            mock();
            return {args, age: this.age};
        }
    }

    const mary = new Person("Mary", 18);

    // void
    let result: any = mary.getName();
    expect(mock).toBeCalledTimes(1);
    expect(result).toStrictEqual({args: [], name: "Mary"});

    result = mary.getName();
    expect(mock).toBeCalledTimes(1);
    expect(result).toStrictEqual({args: [], name: "Mary"});

    // number
    result = mary.getName(123);
    expect(mock).toBeCalledTimes(2);
    expect(result).toStrictEqual({args: [123], name: "Mary"});

    result = mary.getName(123);
    expect(mock).toBeCalledTimes(2);
    expect(result).toStrictEqual({args: [123], name: "Mary"});

    let object: Record<string, number> = {a: 1};
    result = mary.getName(object);
    expect(mock).toBeCalledTimes(3);
    expect(result).toStrictEqual({args: [{a: 1}], name: "Mary"});

    result = mary.getName(object);
    expect(mock).toBeCalledTimes(3);
    expect(result).toStrictEqual({args: [{a: 1}], name: "Mary"});

    result = mary.getName(123);
    expect(mock).toBeCalledTimes(3);
    expect(result).toStrictEqual({args: [123], name: "Mary"});

    object = {...object, b: 2};
    result = mary.getName(object);
    expect(mock).toBeCalledTimes(4);
    expect(result).toStrictEqual({args: [{a: 1, b: 2}], name: "Mary"});

    result = mary.getAge(123);
    expect(mock).toBeCalledTimes(5);
    expect(result).toStrictEqual({args: [123], age: 18});
});
