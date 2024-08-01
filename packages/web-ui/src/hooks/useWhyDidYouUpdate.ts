import React from "react";

export const useWhyDidYouUpdate: typeof _useWhyDidYouUpdate = "_self" in React.createElement("div") ? () => {} : _useWhyDidYouUpdate;

/**
 * Logs in console the diff in props between renders.
 * For debugging use only. Remove before production.
 *
 * https://usehooks.com/useWhyDidYouUpdate/
 *
 * Example usage:
 * ```jsx
 * const ComponentName = ReactUtil.memo("ComponentName", (props: Props) => {
 *     const stateFromStore = useSelector(state => state.app.moduleName.stateFromStore);
 *     useWhyDidYouUpdate("ComponentName", {...props, stateFromStore});
 *     return <div style={props.style}>{props.count}</div>;
 * });
 * ```
 *
 * @param name A tag for identifying the function component using this hook
 * @param props Props of the function component
 */
function _useWhyDidYouUpdate<P extends object>(name: string, props: P): void {
    // Get a mutable ref object where we can store props for comparison next time this hook runs.
    const prevProps = React.useRef<P>();

    React.useEffect(() => {
        if (prevProps.current) {
            // Use changesObj to keep track of changed props
            const changesObj: Partial<{[K in keyof P]: {from: P[K]; to: P[K]}}> = {};
            // Iterate through all keys from previous and current props
            (Object.keys({...prevProps.current!, ...props}) as Array<keyof P>).forEach(key => {
                // Add to changesObj if previous is different from current
                if (prevProps.current![key] !== props[key]) {
                    changesObj[key] = {from: prevProps.current![key], to: props[key]};
                }
            });

            // If changesObj not empty then output to console
            if (Object.keys(changesObj).length) {
                console.info(`%c[%cwhy-did-you-update%c] %c${name}`, "color: inherit", "color: #e36eec", "color: inherit", "color: #f38b54", changesObj);
            }
        }

        // Update previousProps with current props for next hook call
        prevProps.current = props;
    });
}
