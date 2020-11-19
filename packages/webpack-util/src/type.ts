// TODO: migrate WebpackConfigGenerator/type.ts
// TODO: add ProjectStructureChecker/CodeStyleChecker typing, e.g: interface InternalCheckerOptions

export interface InternalCheckerOptions {
    /**
     * Directory of containing the application code.
     * Should contains `package.json`, `tsconfig.json`, `src/`, `index.html` and a main entry.
     */
    projectDirectory: string;
    /**
     * Directories that are transitively depended on by the application,
     * and should be also checked by static analysis tools along the application project folder.
     * Should contains `package.json`, `tsconfig.json`, `src/`.
     */
    extraCheckDirectories?: string[];
}
