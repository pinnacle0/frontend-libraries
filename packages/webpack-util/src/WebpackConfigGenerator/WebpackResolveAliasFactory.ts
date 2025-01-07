import type {DynamicPathResolver} from "../type.js";

interface WebpackResolveAliasMapOptions {
    env: string | null;
    resolvers: DynamicPathResolver[];
}

export class WebpackResolveAliasFactory {
    static generate({env, resolvers}: WebpackResolveAliasMapOptions): {[moduleAlias: string]: string} {
        const moduleAliasMap: {[moduleAlias: string]: string} = {};

        for (const {prefix, resolver} of resolvers) {
            if (prefix in moduleAliasMap) {
                throw new Error(`Duplicated resolver prefix: ${prefix}`);
            } else if (prefix.trim() === "") {
                throw new Error(`Resolver prefix cannot be empty`);
            } else if (/\s/.test(prefix)) {
                throw new Error(`Resolver prefix cannot contain whitespace, received: ${prefix}`);
            }

            if (resolver) {
                const resolvedRealPath = typeof resolver === "string" ? resolver : resolver(env);
                if (resolvedRealPath) {
                    moduleAliasMap[prefix] = resolvedRealPath;
                }
            }
        }

        return moduleAliasMap;
    }
}
