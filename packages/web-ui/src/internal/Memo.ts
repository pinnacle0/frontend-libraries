type AnyFunctionDecorator = (target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<(...args: any[]) => any>) => TypedPropertyDescriptor<(...args: any[]) => any>;

/**
 * For pure functions:
 *
 * Memoize the last computed result, and return the same value if given the same input.
 * Input equality is based on JSON.stringify.
 */
export function Memo(): AnyFunctionDecorator {
    return (target, propertyKey, descriptor) => {
        /**
         * For latest decorator spec, there is only one "target" parameter, which has "descriptor" property.
         *      https://tc39.github.io/proposal-decorators/#sec-decorator-functions-element-descriptor
         *      https://github.com/tc39/proposal-decorators/blob/master/METAPROGRAMMING.md
         */
        const realDescriptor = descriptor || (target as any).descriptor;
        const fn = realDescriptor.value!;
        const cache: Record<string, any> = {};
        realDescriptor.value = function (...args: any[]) {
            const paramKey = args.length ? JSON.stringify(args) : "";
            if (!cache[paramKey]) {
                cache[paramKey] = fn.apply(this, args);
            }
            return cache[paramKey];
        };
        return descriptor || target;
    };
}
