import {Command} from "commander";
import {checkDeps} from "./checkDeps.js";
import {install} from "./install.js";
const packageJSON = require("../../package.json");

const program = new Command();

program.name("pnpm-single-version").alias("psv").version(packageJSON.version);

program.command("check", {isDefault: true}).description("Verify single version dependencies").action(checkDeps);
program.command("install").description("Install the checker file into .psv").action(install);

program.parse();
