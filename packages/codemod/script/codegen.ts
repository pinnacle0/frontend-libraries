import {TaskRunner} from "@pinnacle0/devtool-util";
import fs from "fs-extra";
import path from "path";
import {createToolkit} from "../src/toolkit";
import type {namedTypes} from "ast-types";
import type {NodePath} from "ast-types/lib/node-path";

const Paths = {
    modDirectory: path.join(__dirname, "../src/mod"),
    typeFile: path.join(__dirname, "../src/type.ts"),
};

new TaskRunner("codegen").execute([
    {
        name: "Add new codemod to modType.ts",
        execute: async () => {
            const fileOrDirectory = await fs.readdir(Paths.modDirectory);
            const modNames = fileOrDirectory.map(_ => path.parse(_).name);

            const toolkit = createToolkit();

            const source = await fs.readFile(Paths.typeFile, {encoding: "utf8"});
            const ast = toolkit.parse(source);
            const b = toolkit.builders;
            toolkit.visit(ast, {
                visitIdentifier(path) {
                    if (path.node.name === "Codemod" && path.parent.node.type === "VariableDeclarator" && path.parent.node.init.type === "TSAsExpression") {
                        const tsAsExpression: namedTypes.TSAsExpression = path.parent.node.init;
                        if (tsAsExpression.expression.type !== "ArrayExpression") throw new Error("Make sure `Codemod` in src/type.ts file is a array");
                        tsAsExpression.expression.elements = modNames.map(_ => b.stringLiteral(_));
                    }
                    this.traverse(path);
                },
            });

            await fs.writeFile(Paths.typeFile, toolkit.generate(ast).code, {encoding: "utf8"});
        },
    },
]);
