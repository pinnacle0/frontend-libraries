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

            switch (type) {
                case "Bool":
                    ExpirableLocalStorageUtil.setBool(type, value as boolean, nonExpiredTimestamp);
                    expect(Object.keys(localStorage).includes(`@@EXPIRABLE/${type}`)).toEqual(true);
                    expect(ExpirableLocalStorageUtil.getBool(type, defaultValue as boolean)).toEqual(value);
                    ExpirableLocalStorageUtil.setBool(type, value as boolean, expiredTimestamp);
                    expect(ExpirableLocalStorageUtil.getBool(type, defaultValue as boolean)).toEqual(defaultValue);
                    break;
                case "String":
                    ExpirableLocalStorageUtil.setString(type, value as string, nonExpiredTimestamp);
                    expect(Object.keys(localStorage).includes(`@@EXPIRABLE/${type}`)).toEqual(true);
                    expect(ExpirableLocalStorageUtil.getString(type, defaultValue as string)).toEqual(value);
                    ExpirableLocalStorageUtil.setString(type, value as string, expiredTimestamp);
                    expect(ExpirableLocalStorageUtil.getString(type, defaultValue as string)).toEqual(defaultValue);
                    break;
                case "Number":
                    ExpirableLocalStorageUtil.setNumber(type, value as number, nonExpiredTimestamp);
                    expect(Object.keys(localStorage).includes(`@@EXPIRABLE/${type}`)).toEqual(true);
                    expect(ExpirableLocalStorageUtil.getNumber(type, defaultValue as number)).toEqual(value);
                    ExpirableLocalStorageUtil.setNumber(type, value as number, expiredTimestamp);
                    expect(ExpirableLocalStorageUtil.getNumber(type, defaultValue as number)).toEqual(defaultValue);
                    break;
            }

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
