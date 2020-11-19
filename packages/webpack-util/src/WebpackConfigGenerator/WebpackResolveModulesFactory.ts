interface WebpackResolveModulesFactoryOptions {
    projectSrcDirectory: string;
}

export class WebpackResolveModulesFactory {
    static generate({projectSrcDirectory}: WebpackResolveModulesFactoryOptions): string[] {
        const resolveModules = [];

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
        resolveModules.push(projectSrcDirectory);

        /**
         * The default behavior to resolve non-relative paths is by looking inside `node_modules` folder.
         * Put at the end so this has the lowest precedence.
         */
        resolveModules.push("node_modules");

        return resolveModules;
    }
}
