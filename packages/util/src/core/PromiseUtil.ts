function sleep(ms: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
}

function sleepThenResolve<T>(ms: number, resolvedValue: T): Promise<T> {
    return new Promise<T>(resolve => setTimeout(() => resolve(resolvedValue), ms));
}

export const PromiseUtil = Object.freeze({
    sleep,
    sleepThenResolve,
});
