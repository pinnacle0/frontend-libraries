import yargs from "yargs";
import {Utility} from "./Utility/index.js";

export interface Task {
    name: string;
    execute: () => void | PromiseLike<void>;
    skipInFastMode?: boolean;
}

export class TaskRunner {
    private readonly logger;
    private readonly isFastMode = yargs().parseSync().mode === "fast";

    constructor(private readonly taskName: string) {
        this.logger = Utility.createConsoleLogger(this.taskName);
    }

    execute(tasks: Task[]) {
        this.executeAsync(tasks)
            .then(() => {
                this.logger.info("All task done successfully!");
            })
            .catch(error => {
                console.error(error);
                process.exit(1);
            });
    }

    private async executeAsync(tasks: Task[]) {
        for (const {name, execute, skipInFastMode} of tasks) {
            if (!this.isFastMode || !skipInFastMode) {
                this.logger.task(name);
                await execute();
            }
        }
    }
}
