import fs from "fs";
import path from "path";
import {PrettierUtil} from "../../src/PrettierUtil";

const tmpDirectory = path.join(__dirname, "./__tmp__/check");
const formattedFixturePath = path.join(tmpDirectory, "./formatted.ts");
const unformattedFixturePath = path.join(tmpDirectory, "./unformatted.ts");

describe("PrettierUtil.check", () => {
    beforeAll(() => {
        if (fs.existsSync(tmpDirectory)) fs.rmSync(tmpDirectory, {recursive: true});
        getFixtures().forEach(_ => {
            const fixtureDirectory = path.dirname(_.path);
            if (!fs.existsSync(fixtureDirectory)) fs.mkdirSync(fixtureDirectory, {recursive: true});
            fs.writeFileSync(_.path, _.data, {encoding: "utf8"});
        });
    });

    afterAll(() => {
        // Comment the following line to see the temp files
        if (fs.existsSync(tmpDirectory)) fs.rmSync(tmpDirectory, {recursive: true});
    });

    test("passes when called with formatted file", () => {
        expect(() => PrettierUtil.check(formattedFixturePath)).not.toThrowError();
    });

    test("throws when called with unformatted file", () => {
        expect(() => PrettierUtil.check(unformattedFixturePath)).toThrowError();
    });

    test("throws when called with directory containing unformatted files", () => {
        expect(() => PrettierUtil.check(tmpDirectory)).toThrowError();
    });
});

function getFixtures(): {path: string; data: string}[] {
    return [
        {
            path: path.join(tmpDirectory, "./.prettierrc"),
            data: JSON.stringify({semi: true, singleQuote: true, tabWidth: 2}, null, 2),
        },
        {
            path: formattedFixturePath,
            data: `//
export function fn() {
  console.info('is prettier this file is formatted');
}
`,
        },
        {
            path: unformattedFixturePath,
            data: `//
export function fn ()
{
    console.info("is ugly and unformatted")
};
`,
        },
    ];
}
