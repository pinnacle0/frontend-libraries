import fs from "fs";
import path from "path";
import {BiomeUtil} from "../../src/BiomeUtil.js";
import {describe, beforeAll, afterAll, test, expect} from "vitest";

const tmpDirectory = path.join(import.meta.dirname, "./__tmp__/check");
const formattedFixturePath = path.join(tmpDirectory, "./formatted.ts");
const unformattedFixturePath = path.join(tmpDirectory, "./unformatted.ts");

describe("BiomeUtil.check", () => {
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
        expect(() => BiomeUtil.check(formattedFixturePath)).not.toThrowError();
    });

    test("throws when called with unformatted file", () => {
        expect(() => BiomeUtil.check(unformattedFixturePath)).toThrowError();
    });

    test("throws when called with directory containing unformatted files", () => {
        expect(() => BiomeUtil.check(tmpDirectory)).toThrowError();
    });
});

function getFixtures(): {path: string; data: string}[] {
    return [
        {
            path: path.join(tmpDirectory, "./biome.json"),
            data: JSON.stringify({
                $schema: "https://biomejs.dev/schemas/1.9.4/schema.json",
                formatter: {
                    enabled: true,
                    indentStyle: "space",
                    indentWidth: 2,
                    lineWidth: 200,
                },
                linter: {
                    enabled: false,
                },
                javascript: {
                    formatter: {
                        enabled: true,
                        bracketSameLine: true,
                        bracketSpacing: false,
                        quoteStyle: "double",
                    },
                },
            }),
        },
        {
            path: formattedFixturePath,
            data: `//
export function fn() {
    console.info("is biome this file is formatted");
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
