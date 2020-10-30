import path from "path";
import {Utility} from "./Utility";

export class PrettierUtil {
    static format(file: string): void {
        // TODO: if file is folder, add */**/<.js,ts,....>, else file
        Utility.runCommand("prettier", ["....."]);
    }

    /**
     * Throw error if fail to pass prettier check
     */
    static check(file: string): void {}
}
