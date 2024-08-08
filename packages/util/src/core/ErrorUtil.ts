/**
 * To get a useful error message from a general try-catch.
 * The returned message is for technical log mostly, not user-friendly.
 */
function serialize(error: unknown): string {
    if (error !== null && error !== undefined && !Number.isNaN(error)) {
        try {
            if (error instanceof Error) {
                if (error.name === "AggregateError") {
                    // Special case, for Promise.any() error.message is fixed: "All Promises rejected"
                    // Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError
                    const errors = "errors" in error ? (error.errors as unknown[]) : [];
                    return `[AggregateError]: ${error.message}\n${errors.map(_ => `- ${serialize(_)}`).join("\n")}`;
                } else {
                    return `[${error.name}]: ${error.message}`;
                }
            } else if (Array.isArray(error)) {
                return `[${error.map(serialize).join(", ")}]`;
            } else {
                return JSON.stringify(error);
            }
        } catch {
            return "[Unknown]";
        }
    } else {
        return "[Empty]";
    }
}

export const ErrorUtil = Object.freeze({
    serialize,
});
