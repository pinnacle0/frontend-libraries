import {PromiseUtil} from "../../src/core/PromiseUtil.js";
import {test, expect} from "vitest";

const sleep = <T>(ms: number, resolvedValue: T) => new Promise<T>(resolve => setTimeout(() => resolve(resolvedValue), ms));
const sleepThenReject = <T>(ms: number, rejectedValue: T) => new Promise<T>((_, reject) => setTimeout(() => reject(rejectedValue), ms));

/**
 * Return statement is required for promise-based tests.
 * Ref: https://jestjs.io/docs/en/asynchronous.html#resolves-rejects
 */

test("Promises Race Success", () => {
    const promises: Array<Promise<string>> = [
        sleep(500, "a"),
        sleep(400, "fastest"),
        sleep(800, "b"),
        sleep(10000, "c"), // No matter how long it is, no waiting here
        Promise.reject("error"),
        sleepThenReject(300, "error-300"),
    ];

    return expect(PromiseUtil.raceSuccess(promises)).resolves.toBe("fastest");
});

test("Promises Race Success (All Errors)", () => {
    const promises: Array<Promise<string>> = [sleepThenReject(300, "error-300"), sleepThenReject(500, "error-500")];

    return expect(PromiseUtil.raceSuccess(promises)).rejects.toHaveLength(promises.length);
});
