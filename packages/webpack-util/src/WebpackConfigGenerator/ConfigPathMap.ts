import fs from "fs";
import path from "path";
import {Utility} from "./Utility";

// TODO: review, may delete
export interface ConfigPathMapOptions {
    env: string | null;
    /**
     * Function to dynamically compute additional webpack config from `env`.
     * Should validates if the config contains `publicUrl` field.
     */
    dynamicWebpackConfigResolver: ((env: string) => string) | undefined;
    /**
     * Directory of project to be built.
     * Should contains `package.json`, `tsconfig.json`, etc.
     */
    projectDirectory: string;
    /**
     * Directory of monorepo workspace root.
     */
    workspaceRootDirectory: string;
}

/**
 * Computes and ***checks*** filepaths to be consumed by loaders, plugins, etc.
 * Throws a descriptive error if any files cannot be found.
 * Should not be consumed outside ConfigGenerator.ts.
 */
export class ConfigPathMap {
    readonly tsconfigFile: string;
    readonly prettierConfigFile: string;
    readonly projectSrcDirectory: string;
    readonly dynamicWebpackOutputPublicUrl: string;

    private readonly createError = Utility.taggedErrorFactory("[ConfigGenerator.ConfigPathMap]");

    constructor(private readonly options: ConfigPathMapOptions) {
        this.validateOptions();
        this.tsconfigFile = this.findTsconfigFile();
        this.prettierConfigFile = this.findPrettierConfigFile();
        this.projectSrcDirectory = this.findProjectSrcDirectory();
        this.dynamicWebpackOutputPublicUrl = this.findDynamicWebpackOutputPublicUrl();
        Object.freeze(this);
    }

    private validateOptions(): void {
        const {projectDirectory, workspaceRootDirectory} = this.options;
        if (!(fs.existsSync(projectDirectory) && fs.statSync(projectDirectory).isDirectory())) {
            throw this.createError(`options.projectDirectory is not a directory at "${projectDirectory}". Paths for config files and source directory cannot be computed.`);
        }
        if (!(fs.existsSync(workspaceRootDirectory) && fs.statSync(workspaceRootDirectory))) {
            throw this.createError(`options.workspaceRootDirectory is not a directory at "${workspaceRootDirectory}". Paths for config files and source directory cannot be computed.`);
        }
    }

    private findTsconfigFile(): string {
        const file = path.join(this.options.projectDirectory, "tsconfig.json");
        if (fs.existsSync(file) && fs.statSync(file).isFile()) {
            return file;
        }
        throw this.createError(`tsconfig file cannot be found at "${file}".`);
    }

    private findPrettierConfigFile(): string {
        const projectFile = path.join(this.options.projectDirectory, "prettier.config.js");
        if (fs.existsSync(projectFile) && fs.statSync(projectFile).isFile()) {
            return projectFile;
        }
        const workspaceRootFile = path.join(this.options.workspaceRootDirectory, "prettier.config.js");
        if (fs.existsSync(workspaceRootFile) && fs.statSync(workspaceRootFile).isFile()) {
            return workspaceRootFile;
        }
        throw this.createError(`prettier config file cannot be found at "${projectFile}" or "${workspaceRootFile}".`);
    }

    private findProjectSrcDirectory(): string {
        const directory = path.join(this.options.projectDirectory, "src");
        if (fs.existsSync(directory) && fs.statSync(directory).isDirectory()) {
            return directory;
        }
        throw this.createError(`Project src directory cannot be found at ${this.options.projectDirectory}.`);
    }

    private findDynamicWebpackOutputPublicUrl(): string {
        const {env, dynamicWebpackConfigResolver} = this.options;
        if (!(env && dynamicWebpackConfigResolver)) {
            return "/";
        }

        const dynamicWebpackConfigJsonFilepath = dynamicWebpackConfigResolver(env);

        if (!fs.existsSync(dynamicWebpackConfigJsonFilepath)) {
            throw this.createError(`Cannot load dynamicWebpackConfigJson. (env: ${env}; dynamicWebpackConfigJsonFilepath: ${dynamicWebpackConfigJsonFilepath})`);
        }

        // eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-dynamic-require -- file checked to exists in file system
        const dynamicWebpackConfig = require(dynamicWebpackConfigJsonFilepath);

        if (!("publicPath" in dynamicWebpackConfig)) {
            throw this.createError(`Cannot find key "publicPath" in dynamicWebpackConfigJson. (env: ${env}; dynamicWebpackConfigJsonFilepath: ${dynamicWebpackConfigJsonFilepath})`);
        }

        const publicPath: any = dynamicWebpackConfig.publicPath;

        if (!(typeof publicPath === "string" && /^\/\/[\w-]+(\.[\w-]+)+\/$/.test(publicPath))) {
            throw this.createError(
                [
                    `Invalid key "publicPath" in dynamicWebpackConfigJson.`,
                    `PublicPath must be type string and have pattern "//some.domain-name.com/",`,
                    `but received type (${typeof publicPath}) and value (${JSON.stringify(publicPath)}).`,
                    `env: "${env}"`,
                    `dynamicWebpackConfigJsonFilepath: "${dynamicWebpackConfigJsonFilepath}"`,
                ].join("\n")
            );
        }

        return publicPath as string;
    }
}
