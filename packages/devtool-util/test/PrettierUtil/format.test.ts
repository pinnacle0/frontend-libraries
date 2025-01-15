import fs from "fs";
import path from "path";
import {PrettierUtil} from "../../src/PrettierUtil.js";
import {describe, beforeAll, afterAll, test, expect} from "vitest";

const tmpDirectory = path.join(import.meta.dirname, "./__tmp__/format");

describe("PrettierUtil.format", () => {
    beforeAll(() => {
        if (fs.existsSync(tmpDirectory)) fs.rmSync(tmpDirectory, {recursive: true});
        fs.mkdirSync(tmpDirectory, {recursive: true});
    });

    afterAll(() => {
        fs.rmSync(tmpDirectory, {recursive: true});
    });

    test("when running PrettierUtil.format(emptyDirectory), suppress error", () => {
        expect(() => PrettierUtil.format(tmpDirectory)).not.toThrowError();
    });
});
