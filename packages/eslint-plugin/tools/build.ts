import yargs from "yargs";
import {pathMap} from "../config/path-map";
import * as commands from "./commands";
import * as Util from "./util";

const {packageJson, jestConfig, tsconfig, readMe, distDirectory, srcDirectory, testDirectory} = pathMap;

const print = Util.createPrint("build.ts");

const isFastMode = yargs.argv.mode === "fast";

if (isFastMode) {
    print.info("Fast mode enabled, skipping format checking and testing");
} else {
    new commands.RunFormatterCheckOnly(srcDirectory, testDirectory).run();
    new commands.RunLinter(srcDirectory, testDirectory).run();
    new commands.RunTest(jestConfig).run();
}

new commands.RunBuild({packageJson, tsconfig, readMe, distDirectory}).run();
