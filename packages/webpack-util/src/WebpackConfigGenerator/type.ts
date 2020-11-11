/**
 * Add "--env envName" to command line, if you want to enable dynamic resolution based on envName.
 *
 * Add "--mode fast" to command line, if you want to skip typing/linting check.
 *
 * Add "--profile" to command line, if you want to generate a profile for analysis in project folder.
 * This flag is ignored in development mode.
 * You can use visualizer to analyze: https://chrisbateman.github.io/webpack-visualizer/
 */

export interface WebpackConfigGeneratorOptions {
    /**
     * Directory of project to be built.
     * Should contains `package.json`, `tsconfig.json`, etc.
     * Used to compute paths of config files, source directory, etc.
     */
    projectDirectory: string;
    // TODO: remove below
    /**
     * Directory of monorepo workspace root.
     * Used to compute paths of config files, source directory, etc.
     */
    workspaceRootDirectory: string;
    // TODO: extraCheckFolders?: string[]; explain (prettier, forker-ts-plugin, stylelint-plugin use)
    /**
     * Specify additional file extension postfixes from dependency requests
     * that should be take precedence before the default file extensions.
     * The leading "." should be omitted.
     *
     * A particular usecase is to enable the consumer projects to
     * dynamically resolve component files from shared projects, such as
     * a wrapped component with business logic but uses different layouts
     * on desktop web project and mobile web project, the following
     * file structure can be used:
     *
     * Example usage:
     * ```
     * [ConfigGeneratorOptions]
     * new ConfigGenerator({
     *   extraResolvedPostfix: ["mobile.tsx", "mobile.ts", "mobile.less"],
     *   //...
     * })
     *
     * [Folder structure]
     * workspaceRoot
     * └── web
     *     ├── desktop
     *     │   └── components
     *     │       └── AComponentThatImportsWrappedTableComponent.tsx
     *     ├── mobile
     *     │   └── components
     *     │       └── AComponentThatImportsWrappedTableComponent.tsx
     *     └── shared
     *         └── components
     *             └── WrappedTableComponent
     *                 ├── index.tsx                 (handles business logic)
     *                 ├── TableComponent.tsx        (for desktop web)
     *                 └── TableComponent.mobile.tsx (for mobile web)
     *
     * [/web/shared/components/WrappedTableComponent/index.tsx]
     * import {TableComponent} from "./TableComponent";
     * export class WrappedTableComponent extends React.PureComponent<Props, State> {}
     * ```
     */
    extraResolvedPostfix?: string[];
    /**
     * List of module resolution aliases to dynamically compute from `env`.
     */
    dynamicConfigResolvers?: DynamicConfigResolver[];
    /**
     * Function to dynamically compute additional webpack config from `env`.
     * Currently supports `output.publicUrl` only.
     */
    dynamicWebpackConfigResolver?: ((env: string) => string) | undefined;
    /**
     * Name of main entry output.
     * Defaults to "index".
     */
    indexName?: string;
    /**
     * Extra entries to be bundled separately.
     */
    extraChunks?: Record<string, string>;
    /**
     * Maximum filesize (in KB) allowed by an entry bundle.
     * Entry bundles exceeding the specified filesize (KB) will be warned.
     */
    maxEntryPointKiloByte?: number;
    /**
     * Maximum filesize (in KB) allowed by an asset after transformation (if any).
     * Assets exceeding the specified filesize (KB) will be warned.
     */
    maxAssetKiloByte?: number;
}

export interface ChunkEntry {
    name: string;
    /**
     * Filepath to a file of type html/js/css.
     */
    chunkEntryPath: string;
    /**
     * Output filename of the entry.
     */
    outputFilename: string;
    /**
     * Filepath to an html template file. Omitting this will result in the output having a static filename (***not*** having contenthash).
     *
     * Example usage:
     * Backend requires the "third-party-error-handler" chunk to have a static filename.
     * Content hash should not be included in the output filename if the ChunkEntry does not have htmlPath specified.
     */
    htmlPath?: string; // If undefined, a separate JS chunk with name `"<ChunkEntry.name>.js"` will be generated.
}

export interface HTMLEntry {
    name: string;
    chunkEntryPath: string;
    htmlPath: string;
}

export interface DynamicConfigResolver {
    prefix: string;
    resolveByEnv(env: string): string;
}

export interface TaggedError extends Error {
    "@@tag": "ConfigGeneratorError";
    raw: {tag: string; message: string};
}
