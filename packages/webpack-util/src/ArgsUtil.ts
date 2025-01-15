import yargs from "yargs";

const argv = yargs().parseSync(process.argv);

function currentEnv(): string | null {
    return (argv.env as string) || null;
}

function profilingEnabled(): boolean {
    return Boolean(argv.profile);
}

function isFastMode(): boolean {
    return argv.mode === "fast";
}

function verbose(): boolean {
    return Boolean(argv.verbose);
}

export const ArgsUtil = Object.freeze({
    currentEnv,
    profilingEnabled,
    isFastMode,
    verbose,
});
