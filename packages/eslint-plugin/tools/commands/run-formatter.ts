import * as Util from "../util";

export class RunFormatter {
    private readonly files: string[];
    constructor(...files: string[]) {
        this.files = files;
    }

    async run() {
        this.formatSources();
    }

    private formatSources() {
        Util.formatFile(...this.files);
    }
}
