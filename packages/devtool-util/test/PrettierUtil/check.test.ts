import * as fs from "fs";
import * as path from "path";
import {PrettierUtil} from "../../src";

const formattedFixtureContents = `//
export function professor() {
  console.info('is gae');
}
`;

const unformattedFixtureContents = `//
export function professor ()
{
    console.info("is gae")
};
`;

const fixtureDirectory = path.join(__dirname, "./__tmp_fixtures__");
const prettierrcFile = path.join(__dirname, "./__tmp_fixtures__/.prettierrc");
const formattedFixture = path.join(__dirname, "./__tmp_fixtures__/formatted.ts");
const unformattedFixture = path.join(__dirname, "./__tmp_fixtures__/unformatted.ts");

describe("PrettierUtil.check", () => {
    beforeAll(async () => {
        if (!fs.existsSync(fixtureDirectory)) await fs.promises.mkdir(fixtureDirectory);
        await Promise.all([
            fs.promises.writeFile(prettierrcFile, JSON.stringify({semi: true, singleQuote: true, tabWidth: 2}, null, 2), {encoding: "utf8"}),
            fs.promises.writeFile(formattedFixture, formattedFixtureContents, {encoding: "utf8"}),
            fs.promises.writeFile(unformattedFixture, unformattedFixtureContents, {encoding: "utf8"}),
        ]);
    });

    afterAll(async () => {
        await fs.promises.rm(fixtureDirectory, {recursive: true, force: true});
    });

    test("passes when called with formatted file", () => {
        expect(() => PrettierUtil.check(formattedFixture)).not.toThrowError();
    });

    test("throws when called with unformatted file", () => {
        expect(() => PrettierUtil.check(unformattedFixture)).toThrowError();
    });

    test("throws when called with directory containing unformatted files", () => {
        expect(() => PrettierUtil.check(fixtureDirectory)).toThrowError();
    });
});
