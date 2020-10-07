import * as Util from "../util";

export class RunFormatterCheckOnly {
    private readonly files: string[];
    constructor(...files: string[]) {
        this.files = files;
    }

    async run() {
        this.checkSources();
    }

    private checkSources() {
        Util.checkFile(...this.files);
    }
}
