import fs from "fs";
import {Utility} from "./Utility";

interface WebpackResolveModulesFactoryOptions {
    projectSrcDirectory: string;
}

export class WebpackResolveModulesFactory {
    private readonly createError = Utility.taggedErrorFactory("[ConfigGenerator.WebpackResolveModulesFactory]");
    private readonly resolveModules: string[];

    constructor(private readonly options: WebpackResolveModulesFactoryOptions) {
        this.resolveModules = [];
        this.validateOptions();

        /**
         * To let webpack know how to resolve non-relative paths when `tsconfig.json#compilerOptions.baseUrl` is set to "./src"
         * Maybe refactor to a better resolution/aliasing solution later(?)
         *
         * ```
         * [Folder structure]
         * projectRoot
         * ├── src
         * │   ├── components
         * │   │   └── Button.tsx
         * │   └── modules
         * │       └── main
         * │           └── index.ts
         * └── tsconfig.json
         *
         * [/projectRoot/src/modules/main/index.ts]
         * import {Button} from "components/Button";
         * ```
         */
        this.resolveModules.push(this.options.projectSrcDirectory);
        /**
         * The default behaviour to resolve non-relative paths is by looking inside `node_modules` folder.
         * Put at the end so this has the lowest precedence.
         */
        this.resolveModules.push("node_modules");

        Object.freeze(this);
    }

    get(): string[] {
        Object.freeze(this.resolveModules);
        return this.resolveModules;
    }

    private validateOptions(): void {
        const {projectSrcDirectory} = this.options;
        if (!(fs.existsSync(projectSrcDirectory) && fs.statSync(projectSrcDirectory).isDirectory())) {
            throw this.createError("");
        }
    }
}
