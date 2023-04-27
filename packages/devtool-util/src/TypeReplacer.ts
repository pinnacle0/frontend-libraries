import ts from "typescript";
import fs from "fs";
import {PrettierUtil} from "./PrettierUtil";

type TSType = ts.TypeAliasDeclaration | ts.InterfaceDeclaration | ts.EnumDeclaration;

interface TypeReplacerOptions {
    latestTypeFile: string;
    outdatedTypeFile: string;
    typeToReplace: (node: TSType) => boolean;
}

export class TypeReplacer {
    private latestTypes: TSType[] = [];
    private updatedTypes: TSType[] = [];
    private latestTypeFile: string;
    private outdatedTypeFile: string;
    private typeToReplace: (node: TSType) => boolean;
    private program: ts.Program;

    constructor({latestTypeFile, outdatedTypeFile, typeToReplace}: TypeReplacerOptions) {
        if (!fs.existsSync(latestTypeFile)) {
            throw new Error(`[devtool-util]: TypeReplacer: ${latestTypeFile} does not exist`);
        }

        if (!fs.existsSync(outdatedTypeFile)) {
            throw new Error(`[devtool-util]: TypeReplacer: ${outdatedTypeFile} does not exist`);
        }

        this.latestTypeFile = latestTypeFile;
        this.outdatedTypeFile = outdatedTypeFile;
        this.typeToReplace = typeToReplace;

        this.program = ts.createProgram([this.latestTypeFile, this.outdatedTypeFile], {});
        this.program.getTypeChecker();
    }

    run = () => {
        const latestTypeFileAST = this.program.getSourceFile(this.latestTypeFile);
        latestTypeFileAST && this.visitLatestTypeFile(latestTypeFileAST);
        const outdatedTypeFileAST = this.program.getSourceFile(this.outdatedTypeFile);
        outdatedTypeFileAST && this.visitOutdatedTypeFile(outdatedTypeFileAST);

        fs.writeFileSync(this.outdatedTypeFile, this.updatedTypes.map(_ => _.getFullText()).join("\n"));
        PrettierUtil.format(this.outdatedTypeFile);
    };

    private visit = (node: ts.Node, cb: (node: ts.Node) => void) => {
        cb(node);
        ts.forEachChild(node, node => this.visit(node, cb));
    };

    private visitLatestTypeFile = (node: ts.Node) => this.visit(node, node => this.isTSType(node) && this.typeToReplace(node) && this.latestTypes.push(node));

    private visitOutdatedTypeFile = (node: ts.Node) =>
        this.visit(node, node => {
            if (this.isTSType(node)) {
                const typeRequireUpdate = this.latestTypes.find(type => type.name.getText() === node.name.getText());
                this.updatedTypes.push(typeRequireUpdate || node);
            }
        });

    private isTSType = (node: ts.Node): node is TSType => ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node) || ts.isEnumDeclaration(node);
}
