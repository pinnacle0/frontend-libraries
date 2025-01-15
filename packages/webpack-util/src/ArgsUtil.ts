import yargs from "yargs";

function parseArgv() {
    return yargs().parseSync(process.argv);
}

function currentEnv(): string | null {
    return (parseArgv().env as string) || null;
}

function profilingEnabled(): boolean {
    return Boolean(parseArgv().profile);
}

function isFastMode(): boolean {
    return parseArgv().mode === "fast";
}

function verbose(): boolean {
    return Boolean(parseArgv().verbose);
}

export const ArgsUtil = Object.freeze({
    currentEnv,
    profilingEnabled,
    isFastMode,
    verbose,
});
