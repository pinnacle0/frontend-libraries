/**
 * For pure functions:
 *
 * Memoize the last computed result, and return the same value if given the same input.
 * Input equality is based on JSON.stringify by default.
 */
const MemoCacheKey = Symbol("MemoCacheKey");
const defaultMemoKeyGenerator = (args: any[]) => (args.length ? JSON.stringify(args) : "");

export function Memo<Args extends any[], Return, Fn extends (...args: Args) => Return>(fn: Fn, context: ClassMethodDecoratorContext<any, Fn>) {
    context.addInitializer(function (this) {
        this[MemoCacheKey] = {};
    });
    return function (this: any, ...args: Args) {
        const paramKey = defaultMemoKeyGenerator(args);
        let cache = this[MemoCacheKey][paramKey];
        if (!cache) {
            cache = fn.apply(this, args);
            this[MemoCacheKey][paramKey] = cache;
        }
        return cache;
    };
}
