import {ExpirableLocalStorageUtil} from "@pinnacle0/web-ui/util/ExpirableLocalStorageUtil";

describe("ExpirableLocalStorageUtil", () => {
    [
        ["Bool", true, false],
        ["String", "abc", ""],
        ["Number", 123, 0],
    ].forEach(([type, value, defaultValue]) => {
        test(type as string, () => {
            const currentTimestamp = new Date().getTime();
            const nonExpiredTimestamp = currentTimestamp + 1000;
            const expiredTimestamp = currentTimestamp - 10;

            ExpirableLocalStorageUtil[`set${type}`](type, value, nonExpiredTimestamp);
            expect(Object.keys(localStorage).includes(`@@EXPIRABLE/${type}`)).toEqual(true);
            expect(ExpirableLocalStorageUtil[`get${type}`](type, defaultValue)).toEqual(value);

            ExpirableLocalStorageUtil[`set${type}`](type, value, expiredTimestamp);
            expect(ExpirableLocalStorageUtil[`get${type}`](type, defaultValue)).toEqual(defaultValue);

            // pruned key because the new expiredTimestamp is expired
            expect(Object.keys(localStorage).includes(`@@EXPIRABLE/${type}`)).toEqual(false);
        });
    });

    test("Object", () => {
        const currentTimestamp = new Date().getTime();
        const nonExpiredTimestamp = currentTimestamp + 1000;
        const expiredTimestamp = currentTimestamp - 10;

        ExpirableLocalStorageUtil.setObject("Object", {a: 1}, nonExpiredTimestamp);

        expect(Object.keys(localStorage).includes("@@EXPIRABLE/Object")).toEqual(true);
        expect(ExpirableLocalStorageUtil.getObject("Object", {b: 2}, () => true)).toEqual({a: 1});

        ExpirableLocalStorageUtil.setObject("Object", {a: 1}, expiredTimestamp);
        expect(ExpirableLocalStorageUtil.getObject("Object", {b: 2}, () => true)).toEqual({b: 2});

        // pruned key because the new expiredTimestamp is expired
        expect(Object.keys(localStorage).includes("@@EXPIRABLE/Object")).toEqual(false);
    });
});
