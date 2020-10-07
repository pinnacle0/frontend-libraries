import React from "react";

/**
 * Return an array of 3 element, representing:
 *  - current boolean value
 *  - a function to set the value to true
 *  - a function to set the value to false
 *
 * Example usage:
 * const [showModal, openModal, closeModal] = useBool();
 */
export function useBool(initialValue: boolean = false): [boolean, () => void, () => void] {
    const [value, setValue] = React.useState(initialValue);
    const setValueToTrue = React.useCallback(() => setValue(true), [setValue]);
    const setValueToFalse = React.useCallback(() => setValue(false), [setValue]);

    return [value, setValueToTrue, setValueToFalse];
}
