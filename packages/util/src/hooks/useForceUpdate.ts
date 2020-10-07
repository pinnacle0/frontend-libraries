import React from "react";

export function useForceUpdate() {
    const [, setState] = React.useState<any>();
    const forceUpdate = React.useCallback(() => setState({}), []);
    return forceUpdate;
}
