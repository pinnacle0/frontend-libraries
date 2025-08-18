type Fn<Args extends readonly any[], Return> = (...args: Args) => Return;
type ReplaceFn<Args extends readonly any[], Return> = (fn: Fn<Args, Return>, ...args: Args) => Return;

// TODO/Ian: add optional, rename to functionIntercept
interface ReplaceFunctionOptions<Args extends readonly any[], Return> {
    sync: ReplaceFn<Args, Return>;
    async: ReplaceFn<Args, Promise<Return>>;
}

function replaceFunction<Args extends readonly any[], Return>(replaceFn: ReplaceFunctionOptions<Args, Return>) {
    function factory(fn: Fn<Args, Promise<Return>>): Fn<Args, Promise<Return>>;
    function factory(fn: Fn<Args, Return>): Fn<Args, Return>;

    function factory(fn: Fn<Args, Return | Promise<Return>>): Fn<Args, Return | Promise<Return>> {
        if (isAsyncFunction(fn)) {
            return (...args: Args): Promise<Return> => replaceFn.async(fn, ...args);
        } else if (isSyncFunction(fn)) {
            return (...args: Args): Return => replaceFn.sync(fn, ...args);
        }
        throw new Error("Invalid function type");
    }

    return factory;
}

function isAsyncFunction<Args extends readonly any[], Return>(fn: Fn<Args, Return | Promise<Return>>): fn is Fn<Args, Promise<Return>> {
    return fn.constructor.name === "AsyncFunction";
}

function isSyncFunction<Args extends readonly any[], Return>(fn: Fn<Args, Return | Promise<Return>>): fn is Fn<Args, Return> {
    return fn.constructor.name === "Function";
}

export const DecoratorUtil = Object.freeze({
    replaceFunction,
});
