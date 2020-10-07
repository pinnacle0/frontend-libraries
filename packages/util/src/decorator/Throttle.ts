import {VoidFunctionDecorator} from "./type";

/**
 * For void functions:
 *
 * Limit the call frequency to max 1 time during @millisecond。
 */
export function Throttle(millisecond: number): VoidFunctionDecorator {
    return (target, propertyKey, descriptor) => {
        /**
         * For latest decorator spec, there is only one "target" parameter, which has "descriptor" property.
         *      https://tc39.github.io/proposal-decorators/#sec-decorator-functions-element-descriptor
         *      https://github.com/tc39/proposal-decorators/blob/master/METAPROGRAMMING.md
         */
        const realDescriptor = descriptor || (target as any).descriptor;
        const fn = realDescriptor.value!;
        let lastTime = 0;
        realDescriptor.value = function (...args: any[]) {
            const currentTime = Date.now();
            if (currentTime > lastTime + millisecond) {
                fn.apply(this, args);
                lastTime = currentTime;
            }
        };
        return descriptor || target;
    };
}
