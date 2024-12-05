import {HashUtil} from "../../src/core/HashUtil";
import crypto from "crypto";
import {test, expect} from "vitest";

test("toInteger", () => {
    const keys = [...new Set(Array.from({length: 1000}).map(() => crypto.randomBytes(2).toString("hex")))];
    const hashCount = new Set(keys.map(key => Math.abs(HashUtil.toInteger(key)))).size;
    expect(hashCount / keys.length).not.toBeLessThanOrEqual(0.999);
});
