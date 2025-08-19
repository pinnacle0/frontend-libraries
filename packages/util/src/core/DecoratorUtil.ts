type Fn<Args extends readonly any[], Return> = (...args: Args) => Return;
type ReplaceFn<Args extends readonly any[], Return> = (fn: Fn<Args, Return>, ...args: Args) => Return;

/**
 * Replace function with a new function with type safe.
 * You can defined Args and Return type for decorated function.
 *
 * @example
 * ```ts
 * const replaceFn = DecoratorUtil.interceptFunction<[arg1: string, arg2:number], number>((fn, arg1, arg2) => {
 *     // do something before the function is called
 *     return fn(...args); // number
 * });
 * ```
 *
 * @typeParam Args - The arguments of the function. default is `any[]`.
 * @typeParam Return - The return type of the function. default is `any`.
 * @param replaceFn - The function to replace the original function.
 * @returns The decorator factory function.
 */
function interceptFunction<Args extends readonly any[] = any[], Return = any>(replaceFn: ReplaceFn<Args, Return>) {
    return (fn: Fn<Args, Return>) =>
        (...args: Args) =>
            replaceFn(fn, ...args);
}

export const DecoratorUtil = Object.freeze({
    interceptFunction,
});
