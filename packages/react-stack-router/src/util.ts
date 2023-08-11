const PREFIX = "[react-stack-router]";

export function invariant(condition: any, message: string): asserts condition {
    if (condition) {
        return;
    }
    throw new Error(`${PREFIX} ${message}`);
}

export function createKey() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
