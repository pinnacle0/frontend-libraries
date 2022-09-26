import React from "react";

export function useDidMountEffect(onMount: () => void) {
    React.useEffect(() => {
        onMount();
        // eslint-disable-next-line react-hooks/exhaustive-deps -- this is intentional to emulate the behaviour of componentDidMount
    }, []);
}
