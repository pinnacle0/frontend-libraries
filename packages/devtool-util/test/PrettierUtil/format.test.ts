import fs from "fs";
import path from "path";
import {PrettierUtil} from "../../src/PrettierUtil";

const tmpDirectory = path.join(__dirname, "./__tmp__/format");

describe("Prettier.format", () => {
    beforeAll(() => {
        fs.rmdirSync(tmpDirectory, {recursive: true});
        fs.mkdirSync(tmpDirectory, {recursive: true});
    });

    afterAll(() => {
        fs.rmdirSync(tmpDirectory, {recursive: true});
    });

    test("when running Prettier.format(emptyDirectory), suppress error", () => {
        expect(() => PrettierUtil.format(tmpDirectory)).not.toThrowError();
    });
});
