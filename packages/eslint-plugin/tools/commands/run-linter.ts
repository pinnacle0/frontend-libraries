import * as Util from "../util";

export class RunLinter {
    private readonly files: string[];
    constructor(...files: string[]) {
        this.files = files;
    }

    async run() {
        this.lintSources();
    }

    private lintSources() {
        Util.lintFile(...this.files);
    }
}
