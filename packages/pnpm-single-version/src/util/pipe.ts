type OperationFunction<P, R> = (value: P) => R

export function pipe<P, A>(op1: OperationFunction<P, A>): (initial: P) => A
export function pipe<P, A, B>(op1: OperationFunction<P, A>, op2: OperationFunction<A, B>): (initial?: P) => B
export function pipe<P, A, B, C>(
    op1: OperationFunction<P, A>,
    op2: OperationFunction<A, B>,
    op3: OperationFunction<B, C>
): (initial?: P) => C
export function pipe<P, A, B, C, D>(
    op1: OperationFunction<P, A>,
    op2: OperationFunction<A, B>,
    op3: OperationFunction<B, C>,
    op4: OperationFunction<C, D>
): (initial?: P) => D
export function pipe<P, A, B, C, D, E>(
    op1: OperationFunction<P, A>,
    op2: OperationFunction<A, B>,
    op3: OperationFunction<B, C>,
    op4: OperationFunction<C, D>,
    op5: OperationFunction<D, E>
): (initial?: P) => E
export function pipe<P, A, B, C, D, E, F>(
    op1: OperationFunction<P, A>,
    op2: OperationFunction<A, B>,
    op3: OperationFunction<B, C>,
    op4: OperationFunction<C, D>,
    op5: OperationFunction<D, E>,
    op6: OperationFunction<E, F>
): (initial?: P) => F
export function pipe<P, A, B, C, D, E, F, G>(
    op1: OperationFunction<P, A>,
    op2: OperationFunction<A, B>,
    op3: OperationFunction<B, C>,
    op4: OperationFunction<C, D>,
    op5: OperationFunction<D, E>,
    op6: OperationFunction<E, F>,
    op7: OperationFunction<F, G>
): (initial?: P) => G
export function pipe(...ops: Array<OperationFunction<any, any>>): (initial?: any) => any
export function pipe(...fns: any[]) {
    return (initial: any) => fns.reduce((p, f) => f(p), initial)
}
