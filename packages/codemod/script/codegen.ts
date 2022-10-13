import {TaskRunner} from "@pinnacle0/devtool-util";
import fs from "fs-extra";
import path from "path";

const Paths = {
    modDirectory: path.join(__dirname, "../src/mod"),
    modTypes: path.join(__dirname, "../src/modType.ts"),
};

new TaskRunner("codegen").execute([
    {
        name: "Add new codemod to modType.ts",
        execute: async () => {
            const fileOrDirectory = await fs.readdir(Paths.modDirectory);
            const mods = fileOrDirectory.map(_ => path.parse(_).name);

            const content = `export type ModType = ${mods.map(_ => `"${_}"`).join("| ")};`;

            // await fs.writeFile(Paths.modTypes, ModeTypeComment + content, {encoding: "utf8"});
        },
    },
]);
