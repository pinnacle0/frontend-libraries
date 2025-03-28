import type {nameVerFromPkgSnapshot} from "@pnpm/lockfile-utils";

export interface CheckerOptions {
    includes: string[];
    /**
     * default: true
     * In CI env, exit with status code 1 when checker found multiple version on specified dependencies.
     */
    failOnCI?: boolean;
}

export interface LoggerType {
    error(error: Error): void;
    message(value: string): void;
}

export type PackageInfo = ReturnType<typeof nameVerFromPkgSnapshot>;
