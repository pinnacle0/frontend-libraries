import {ExpirableLocalStorageUtil} from "../../src/util/ExpirableLocalStorageUtil";
import {describe, test, expect} from "vitest";

describe("ExpirableLocalStorageUtil", () => {
    test("Bool", () => {
        const type = "Bool";
        const value = true;
        const defaultValue = false;

        const currentTimestamp = new Date().getTime();
        const nonExpiredTimestamp = currentTimestamp + 1000;
        const expiredTimestamp = currentTimestamp - 10;

        ExpirableLocalStorageUtil.setBool(type, value, nonExpiredTimestamp);
        expect(Object.keys(localStorage).includes(`@@EXPIRABLE/${type}`)).toEqual(true);
        expect(ExpirableLocalStorageUtil.getBool(type, defaultValue)).toEqual(value);
        ExpirableLocalStorageUtil.setBool(type, value, expiredTimestamp);
        expect(ExpirableLocalStorageUtil.getBool(type, defaultValue)).toEqual(defaultValue);

        // pruned key because the new expiredTimestamp is expired
        expect(Object.keys(localStorage).includes(`@@EXPIRABLE/${type}`)).toEqual(false);
    });

    test("Number", () => {
        const type = "String";
        const value = 123;
        const defaultValue = 0;

        const currentTimestamp = new Date().getTime();
        const nonExpiredTimestamp = currentTimestamp + 1000;
        const expiredTimestamp = currentTimestamp - 10;

        ExpirableLocalStorageUtil.setNumber(type, value, nonExpiredTimestamp);
        expect(Object.keys(localStorage).includes(`@@EXPIRABLE/${type}`)).toEqual(true);
        expect(ExpirableLocalStorageUtil.getNumber(type, defaultValue)).toEqual(value);
        ExpirableLocalStorageUtil.setNumber(type, value, expiredTimestamp);
        expect(ExpirableLocalStorageUtil.getNumber(type, defaultValue)).toEqual(defaultValue);
    });

    test("String", () => {
        const type = "Number";
        const value = "abc";
        const defaultValue = "";

        const currentTimestamp = new Date().getTime();
        const nonExpiredTimestamp = currentTimestamp + 1000;
        const expiredTimestamp = currentTimestamp - 10;

        ExpirableLocalStorageUtil.setString(type, value, nonExpiredTimestamp);
        expect(Object.keys(localStorage).includes(`@@EXPIRABLE/${type}`)).toEqual(true);
        expect(ExpirableLocalStorageUtil.getString(type, defaultValue)).toEqual(value);
        ExpirableLocalStorageUtil.setString(type, value, expiredTimestamp);
        expect(ExpirableLocalStorageUtil.getString(type, defaultValue)).toEqual(defaultValue);
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
