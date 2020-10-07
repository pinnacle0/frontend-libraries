import fs from "fs-extra";
import path from "path";
import {PathMap} from "../../config/path-map";
import * as Util from "../util";

const print = Util.createPrint("RunBuild");

interface Options extends Pick<PathMap, "packageJson" | "tsconfig" | "readMe" | "distDirectory"> {}

export class RunBuild {
    private readonly packageJsonPath: string;
    private readonly tsconfigPath: string;
    private readonly readMePath: string;
    private readonly distDirectory: string;
    constructor(_: Options) {
        this.packageJsonPath = _.packageJson;
        this.tsconfigPath = _.tsconfig;
        this.readMePath = _.readMe;
        this.distDirectory = _.distDirectory;
    }

    async run() {
        try {
            this.cleanDistFolder();
            this.compileToJs();
            this.distribute();
        } catch (error) {
            print.error(["Error occurred during build", error]);
            try {
                fs.removeSync(path.join(this.distDirectory));
                // eslint-disable-next-line no-empty
            } catch (_) {}
        }
    }

    private cleanDistFolder() {
        print.task("Cleaning dist folder");
        fs.emptyDirSync(this.distDirectory);
    }

    private compileToJs() {
        print.task("Compiling...");
        Util.runProcess("tsc", ["--project", this.tsconfigPath], "Compile failed, please fix");
    }

    private distribute() {
        print.task("Copying files to distribution folder");
        const distLib = path.join(this.distDirectory, "lib");
        const distOut = path.join(this.distDirectory, "out");
        const distLibPackageJson = path.join(distLib, "package.json");
        const distLibReadMe = path.join(distLib, "README.md");

        fs.mkdirsSync(distLib);
        fs.copySync(distOut, distLib, {dereference: true});
        const packageJson = {
            ...JSON.parse(fs.readFileSync(this.packageJsonPath, {encoding: "utf8"})),
            main: "index.js",
            types: "index.d.ts",
        };
        fs.writeFileSync(distLibPackageJson, JSON.stringify(packageJson, null, 4));
        fs.copySync(this.readMePath, distLibReadMe, {dereference: true});

        fs.removeSync(distOut);
    }
}
