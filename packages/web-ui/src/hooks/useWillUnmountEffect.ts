import React from "react";

export function useWillUnmountEffect(willUnmount: () => void) {
    React.useEffect(() => {
        return willUnmount;
        // eslint-disable-next-line react-hooks/exhaustive-deps -- this is intentional to emulate the behaviour of componentWillUnmount
    }, []);
}
