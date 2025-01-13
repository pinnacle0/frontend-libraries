import fs from "fs";
import path from "path";
import {BiomeUtil} from "../../src/BiomeUtil.js";
import {describe, beforeAll, afterAll, test, expect} from "vitest";

const tmpDirectory = path.join(import.meta.dirname, "./__tmp__/format");

describe("BiomeUtil.format", () => {
    beforeAll(() => {
        if (fs.existsSync(tmpDirectory)) fs.rmSync(tmpDirectory, {recursive: true});
        fs.mkdirSync(tmpDirectory, {recursive: true});
    });

    afterAll(() => {
        fs.rmSync(tmpDirectory, {recursive: true});
    });

    test("when running BiomeUtil.format(emptyDirectory), suppress error", () => {
        expect(() => BiomeUtil.format(tmpDirectory)).not.toThrowError();
    });
});
