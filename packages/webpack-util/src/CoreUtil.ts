import yargs from "yargs";

function currentEnv(): string | null {
    return (yargs.argv.env as string) || null;
}

function profilingEnabled(): boolean {
    return Boolean(yargs.argv.profile);
}

function isFastMode(): boolean {
    return yargs.argv.mode === "fast";
}

function verbose(): boolean {
    return Boolean(yargs.argv.verbose);
}

export const CoreUtil = Object.freeze({
    currentEnv,
    profilingEnabled,
    isFastMode,
    verbose,
});
