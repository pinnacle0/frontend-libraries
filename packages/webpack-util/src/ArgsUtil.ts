import yargs from "yargs";

const args = yargs.parseSync();

function currentEnv(): string | null {
    return (args.env as string) || null;
}

function profilingEnabled(): boolean {
    return Boolean(args.profile);
}

function isFastMode(): boolean {
    return args.mode === "fast";
}

function verbose(): boolean {
    return Boolean(args.verbose);
}

export const ArgsUtil = Object.freeze({
    currentEnv,
    profilingEnabled,
    isFastMode,
    verbose,
});
