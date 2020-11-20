import {Utility} from "@pinnacle0/devtool-util/src";
import fs from "fs";
import path from "path";
import yargs from "yargs";

const version = yargs.argv._[0];
const semverRegExp = /\d+\.\d+\.\d+/;
const print = Utility.createConsoleLogger("publish");
const FilePath = {
    dist: path.join(__dirname, "../dist"),
    publishDirectory: path.join(__dirname, "../dist"),
};

if (yargs.argv._.length !== 1) {
    print.error("Missing positional argument (version). Example usage: `yarn pub 1.0.0`");
    process.exit(1);
}

if (!semverRegExp.test(version)) {
    print.error(`Invalid version number "${version}". Example usage: \`yarn pub 1.0.0\``);
    process.exit(1);
}

if (!(fs.existsSync(FilePath.dist) && fs.statSync(FilePath.dist).isDirectory())) {
    print.error(`Please run \`yarn build\` before running \`yarn pub ${version}\`.`);
    process.exit(1);
}

print.info(`Publishing version "${version}"`);
Utility.runCommand("yarn", ["publish", "--new-version", version, FilePath.publishDirectory]);
