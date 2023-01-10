import type webpack from "webpack";

const PLUGIN_NAME = "NonES5ModulePlugin";

export class NonES5ModulePlugin {
    private checkedModule = new Set();
    private defaulExcludeRegex = /node_modules/;
    private moduleListMatchRegex: RegExp;

    constructor(private moduleList: string[]) {
        const escapedPatterns = moduleList.filter(_ => _.length > 0).map(_ => _.replace("/", "\\/") + "(\\/|$)");
        this.moduleListMatchRegex = new RegExp(`node_modules\\/(${escapedPatterns.join("|")})`);
    }

    isRegularNodeModules(path: string): boolean {
        const match = this.moduleListMatchRegex.exec(path);
        if (match && match[1].length > 0) {
            this.checkedModule.add(match[1]);
            console.info(Array.from(this.checkedModule));
            return false;
        }
        return this.defaulExcludeRegex.test(path);
    }

    plugin() {
        const checkedModule = this.checkedModule;
        return new (class implements webpack.WebpackPluginInstance {
            apply(compiler: webpack.Compiler) {
                compiler.hooks.afterCompile.tap(PLUGIN_NAME, () => {
                    console.info(checkedModule);
                });
            }
        })();

        // const missed = this.missed();
        // if (missed.length > 0) {
        //     throw new Error(`Following modules have not been transpile to ES5:\n ${missed.map(_ => `\t${_}\n`)}`);
        // }
    }

    private missed(): string[] {
        return this.moduleList.filter(_ => !this.checkedModule.has(_));
    }
}
