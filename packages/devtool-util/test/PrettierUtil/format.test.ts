import fs from "fs";
import path from "path";
import {PrettierUtil} from "../../src/PrettierUtil";

const tmpDirectory = path.join(__dirname, "./__tmp__/format");

describe("Prettier.format", () => {
    beforeAll(() => {
        if (fs.existsSync(tmpDirectory)) fs.rmSync(tmpDirectory, {recursive: true});
        fs.mkdirSync(tmpDirectory, {recursive: true});
    });

    afterAll(() => {
        fs.rmSync(tmpDirectory, {recursive: true});
    });

    test("when running Prettier.format(emptyDirectory), suppress error", () => {
        expect(() => PrettierUtil.format(tmpDirectory)).not.toThrowError();
    });
});
