import * as Util from "../util";

const print = Util.createPrint("RunTest");

export class RunTest {
    // prettier-ignore
    constructor(
        private readonly jestConfigPath: string
    ) {}

    async run() {
        this.runJest();
    }

    private runJest() {
        print.task("Running jest");
        Util.runProcess("jest", ["--config", this.jestConfigPath], "Test failed");
    }
}
