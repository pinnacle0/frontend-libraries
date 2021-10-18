import {ExpirableLocalStorageUtil} from "@pinnacle0/web-ui/util/ExpirableLocalStorageUtil";

describe("ExpirableStorageHelper", () => {
    [
        ["Bool", true, false],
        ["String", "abc", ""],
        ["Number", 123, 0],
    ].forEach(([type, value, defaultValue]) => {
        test(type as string, () => {
            ExpirableLocalStorageUtil[`set${type}`](type, value, new Date().getTime() + 1000);
            expect(Object.keys(localStorage).includes(`@@EXPIRABLE/${type}`)).toEqual(true);
            expect(ExpirableLocalStorageUtil[`get${type}`](type, defaultValue)).toEqual(value);
            ExpirableLocalStorageUtil[`set${type}`](type, value, new Date().getTime() - 10);
            expect(Object.keys(localStorage).includes(`@@EXPIRABLE/${type}`)).toEqual(false);
            expect(ExpirableLocalStorageUtil[`get${type}`](type, defaultValue)).toEqual(defaultValue);
        });
    });

    test("Object", () => {
        ExpirableLocalStorageUtil.setObject("Object", {a: 1}, new Date().getTime() + 1000);
        expect(Object.keys(localStorage).includes("@@EXPIRABLE/Object")).toEqual(true);
        expect(ExpirableLocalStorageUtil.getObject("Object", {b: 2}, () => true)).toEqual({a: 1});
        ExpirableLocalStorageUtil.setObject("Object", {a: 1}, new Date().getTime() - 10);
        expect(Object.keys(localStorage).includes("@@EXPIRABLE/Object")).toEqual(false);
        expect(ExpirableLocalStorageUtil.getObject("Object", {b: 2}, () => true)).toEqual({b: 2});
    });
});
