import fs from "fs";
import {DynamicConfigResolver} from "./type";

interface WebpackResolveAliasMapOptions {
    env: string | null;
    dynamicConfigResolvers: DynamicConfigResolver[];
}

export class WebpackResolveAliasFactory {
    static generate({env, dynamicConfigResolvers}: WebpackResolveAliasMapOptions): {[moduleAlias: string]: string} {
        if (env === null) {
            return {};
        }

        const moduleAliasMap: {[moduleAlias: string]: string} = {};

        for (const {prefix, resolveByEnv} of dynamicConfigResolvers) {
            if (prefix in moduleAliasMap) {
                throw new Error(`Duplicated key for dynamic resolver: ${prefix}`);
            }
            moduleAliasMap[prefix] = WebpackResolveAliasFactory.resolveRealPath(env, {prefix, resolveByEnv});
        }

        return moduleAliasMap;
    }

    private static resolveRealPath(env: string, {prefix, resolveByEnv}: DynamicConfigResolver): string {
        const realPath = resolveByEnv(env);
        if (prefix.trim() === "") {
            throw new Error(`Resolver prefix cannot be empty`);
        } else if (/\s/.test(prefix)) {
            throw new Error(`Resolver prefix cannot contain whitespace, received: ${prefix}`);
        } else if (!fs.existsSync(realPath)) {
            throw new Error(`Dynamically resolved alias does not exists, prefix: ${prefix}, resolvedPath: ${realPath}`);
        }
        return realPath;
    }
}
