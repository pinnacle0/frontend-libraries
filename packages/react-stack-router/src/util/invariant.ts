const PREFIX = "[react-stack-router]";

export function invariant(condition: any, message: string): asserts condition {
    if (condition) {
        return;
    }
    throw new Error(`${PREFIX} ${message}`);
}
