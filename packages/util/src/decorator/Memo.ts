/**
 * For pure functions:
 *
 * Memoize the last computed result, and return the same value if given the same input.
 * Input equality is based on JSON.stringify by default.
 */
const MemoCacheKey = Symbol("MemoCacheKey");
const defaultMemoKeyGenerator = (args: any[]) => (args.length ? JSON.stringify(args) : "");
type FunctionResultCacheStore<Fn> = Map<Fn, Map<string, any>>;

export function Memo<Args extends any[], Return, Fn extends (...args: Args) => Return>(fn: Fn, context: ClassMethodDecoratorContext<any, Fn>) {
    context.addInitializer(function (this) {
        this[MemoCacheKey] = new Map();
    });
    return function (this: any, ...args: Args) {
        const paramKey = defaultMemoKeyGenerator(args);
        const store: FunctionResultCacheStore<Fn> = this[MemoCacheKey];

        let functionCache = store.get(fn);
        if (!functionCache) {
            functionCache = new Map();
            store.set(fn, functionCache);
        }

        if (!functionCache.has(paramKey)) {
            functionCache.set(paramKey, fn.apply(this, args));
        }

        return functionCache.get(paramKey);
    };
}
