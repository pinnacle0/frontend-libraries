import * as fs from "fs";
import * as path from "path";
import {PrettierUtil} from "../../src";

const tmpDirectory = path.join(__dirname, "./__tmp__/format");

describe("Prettier.format", () => {
    beforeAll(() => {
        fs.rmSync(tmpDirectory, {recursive: true, force: true});
        fs.mkdirSync(tmpDirectory, {recursive: true});
    });

    afterAll(() => {
        fs.rmSync(tmpDirectory, {recursive: true, force: true});
    });

    test("when running Prettier.format(emptyDirectory), suppress error", () => {
        expect(() => PrettierUtil.format(tmpDirectory)).not.toThrowError();
    });
});
