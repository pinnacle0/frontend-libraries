/**
 * For void functions:
 *
 * Limit the call frequency to max 1 time during @millisecond。
 */
export function Throttle<This, Args extends any[], Fn extends (this: This, ...args: Args) => void>(millisecond: number) {
    let lastTime = 0;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- keep context for type inference
    return (target: Fn, _context: ClassMethodDecoratorContext<any, Fn>) => {
        const replacement = function (this: This, ...args: Args) {
            const currentTime = Date.now();
            if (currentTime > lastTime + millisecond) {
                target.apply(this, args);
                lastTime = currentTime;
            }
        };

        return replacement as Fn;
    };
}
