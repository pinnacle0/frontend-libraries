/**
 * Only resolve with the first-resolved value.
 * If none of the promises resolves (all rejects), this function rejects with a list of errors (rejected values).
 * Ref: https://stackoverflow.com/questions/37234191/resolve-es6-promise-with-first-success
 */
function raceSuccess<T>(promises: Array<PromiseLike<T>>): PromiseLike<T> {
    const reversedPromises = promises.map(_ =>
        _.then(
            val => Promise.reject(val),
            err => Promise.resolve(err)
        )
    );
    return Promise.all(reversedPromises).then(
        errors => Promise.reject(errors),
        val => Promise.resolve(val)
    );
}

function sleep(ms: number): Promise<void> {
    return new Promise(res => {
        setTimeout(res, ms);
    });
}

export const PromiseUtil = Object.freeze({
    raceSuccess,
    sleep,
});
