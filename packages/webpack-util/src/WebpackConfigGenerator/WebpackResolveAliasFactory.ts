import fs from "fs";
import {DynamicConfigResolver} from "./type";
import {Utility} from "./Utility";

interface WebpackResolveAliasMapOptions {
    env: string | null;
    dynamicConfigResolvers: DynamicConfigResolver[];
}

export class WebpackResolveAliasFactory {
    private readonly createError = Utility.taggedErrorFactory("[ConfigGenerator.WebpackResolveAliasFactory]");
    private readonly resolveAlias: Record<string, string>;

    constructor(private readonly options: WebpackResolveAliasMapOptions) {
        const {env} = this.options;
        this.resolveAlias = {};

        if (env === null) {
            return;
        }

        for (const entry of this.options.dynamicConfigResolvers) {
            const {prefix, resolvedAlias} = this.resolveEntry(env, entry);
            if (prefix in this) {
                throw this.createError(`Key collision when creating aliases for dynamic resolver. conflicting key: "${prefix}", ${this.getExtraDiagnosticInfo()}`);
            }
            this.resolveAlias[prefix] = resolvedAlias;
        }

        Object.freeze(this);
    }

    get(): {[moduleAlias: string]: string} {
        Object.freeze(this.resolveAlias);
        return this.resolveAlias;
    }

    private getExtraDiagnosticInfo(): string {
        return (
            `provided config aliases: ` +
            this.options.dynamicConfigResolvers
                .map(_ => _.prefix)
                .map(_ => `"${_}"`)
                .join(", ")
        );
    }

    private resolveEntry(env: string, {prefix, resolveByEnv}: DynamicConfigResolver): {prefix: string; resolvedAlias: string} {
        const resolvedAlias = resolveByEnv(env);
        if (prefix.trim() === "") {
            throw this.createError(`Resolver prefix cannot be empty. (${this.getExtraDiagnosticInfo()})`);
        } else if (/\s/.test(prefix)) {
            throw this.createError(`Resolver prefix cannot contain whitespace, received "${prefix}". (${this.getExtraDiagnosticInfo()})`);
        } else if (prefix.toLowerCase() !== prefix) {
            throw this.createError(`Resolver prefix must be all lower-case, received "${prefix}". (${this.getExtraDiagnosticInfo()})`);
        } else if (resolvedAlias.trim() === "") {
            throw this.createError(`Dynamically resolved alias cannot be empty. (env: "${env}"; prefix: "${prefix}"; ${this.getExtraDiagnosticInfo()})`);
        } else if (/\s/.test(resolvedAlias)) {
            throw this.createError(`Dynamically resolved alias cannot contain whitespace, computed as "${resolvedAlias}". (env: "${env}"; prefix: "${prefix}"; ${this.getExtraDiagnosticInfo()})`);
        } else if (resolvedAlias.toLowerCase() !== resolvedAlias) {
            throw this.createError(`Dynamically resolved alias must be all lower-cased, computed as "${resolvedAlias}". (env: "${env}"; prefix: "${prefix}"; ${this.getExtraDiagnosticInfo()})`);
        } else if (!fs.existsSync(resolvedAlias)) {
            throw this.createError(`Dynamically resolved alias does not exists, computed as "${resolvedAlias}". (env: "${env}"; prefix: "${prefix}"; ${this.getExtraDiagnosticInfo()})`);
        } else {
            return {prefix, resolvedAlias};
        }
    }
}
