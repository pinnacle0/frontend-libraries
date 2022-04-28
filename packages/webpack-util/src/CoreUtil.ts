import yargs from "yargs";

function currentEnv(): string | null {
    return (yargs.parseSync().env as string) || null;
}

function profilingEnabled(): boolean {
    return Boolean(yargs.parseSync().profile);
}

function isFastMode(): boolean {
    return yargs.parseSync().mode === "fast";
}

function verbose(): boolean {
    return Boolean(yargs.parseSync().verbose);
}

export const CoreUtil = Object.freeze({
    currentEnv,
    profilingEnabled,
    isFastMode,
    verbose,
});
