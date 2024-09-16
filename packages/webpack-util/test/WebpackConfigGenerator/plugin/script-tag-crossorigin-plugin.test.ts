import path from "path";
import fs from "fs";
import {rspack} from "@rspack/core";
import HTMLWebpackPlugin from "html-webpack-plugin";
import type {Configuration} from "@rspack/core";
import {ScriptTagCrossOriginPlugin} from "../../../src/WebpackConfigGenerator/Plugin/script-tag-crossorigin-plugin";

const OUTPUT_DIR = path.join(__dirname, "./dist");
type Entry = Omit<Configuration["entry"], "undefined">;
const createConfig = (entry: Entry): Configuration => ({
    mode: "production",
    entry,
    output: {
        filename: "[name].js",
        path: OUTPUT_DIR,
        clean: true,
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.join(__dirname, "./fixture/index.html"),
        }),
        new ScriptTagCrossOriginPlugin(),
    ],
});

describe("script-tag-crossorigin-plugin test: Add crossorigin='anonymous'", () => {
    const testPlugin = (entry: Entry, expectedResults: RegExp[], done: () => void) => {
        const config: Configuration = createConfig(entry);
        rspack(config).run(error => {
            expect(error).toBeFalsy();
            const outputFile = fs.readFileSync(path.join(OUTPUT_DIR, "index.html"));
            expectedResults.forEach(expectedResult => expect(outputFile.toString()).toMatch(expectedResult));
            done();
        });
    };

    test("single entry script tag", done => {
        testPlugin(
            {
                main: path.join(__dirname, "./fixture/script.js"),
            },
            [new RegExp('<script.+src="main.js".+crossorigin', "gm")],
            done
        );
    });
    test("multiple entry script tag", done => {
        testPlugin(
            {
                main: path.join(__dirname, "./fixture/script.js"),
                second: path.join(__dirname, "./fixture/script.js"),
            },
            [new RegExp('<script.+src="main\\.js".+crossorigin', "gm"), new RegExp('<script.+src="second\\.js".+crossorigin', "gm")],
            done
        );
    });
});
