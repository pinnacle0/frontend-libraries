import path from "path";
import fs from "fs";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import {ScriptTagCrossOriginPlugin} from "../../../src/WebpackConfigGenerator/Plugin/ScriptTagCrossOriginPlugin";

const OUTPUT_DIR = path.join(__dirname, "./dist");
type Entry = Omit<webpack.Configuration["entry"], "undefined">;
const createConfig = (entry: Entry): webpack.Configuration => ({
    mode: "production",
    entry,
    output: {
        path: OUTPUT_DIR,
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
        }),
        new ScriptTagCrossOriginPlugin(),
    ],
});

describe("ScriptTagCrossOriginPlugin test : Add crossorigin='anonymous'", () => {
    beforeEach(done => {
        fs.rmSync(OUTPUT_DIR, {force: true, recursive: true});
        done();
    });

    const testPlugin = (entry: Entry, expectedResult: RegExp, done: () => void) => {
        const config: webpack.Configuration = createConfig(entry);
        webpack(config, error => {
            expect(error).toBeFalsy();
            const outputFile = fs.readFileSync(path.join(OUTPUT_DIR, "index.html"));
            expect(outputFile.toString()).toMatch(expectedResult);
            done();
        });
    };

    test("single entry script tag", done => {
        testPlugin(
            {
                main: path.join(__dirname, "./fixture/script.js"),
            },
            new RegExp('<script.+src.+\\main.js.+crossorigin="anonymous"', "gm"),
            done
        );
    });
    test.only("multiple entry script tag", done => {
        testPlugin(
            {
                main: path.join(__dirname, "./fixture/script.js"),
                second: path.join(__dirname, "./fixture/script.js"),
            },
            new RegExp('<script.+src.+\\main.js.+crossorigin="anonymous".*>.+<script.+src.+second\\.js.+crossorigin="anonymous"', "gm"),
            done
        );
    });
});
