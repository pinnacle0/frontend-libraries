import React from "react";
import type {ControlledFormValue} from "@pinnacle0/web-ui/internal/type";

type ExtractValueType<F extends ControlledFormValue<any>> = F["value"] extends infer V ? V : never;

export const withUncontrolledInitialValue = <T extends ControlledFormValue<any>>(WrappedComponent: React.ComponentType<T>) => {
    const Injected = ({initialValue, ...rest}: Omit<T, keyof ControlledFormValue<ExtractValueType<T>>> & {initialValue: ExtractValueType<T>}) => {
        const [value, setValue] = React.useState(initialValue);
        return <WrappedComponent {...((rest as unknown) as T)} value={value} onChange={setValue} />;
    };
    Injected.displayName = `withUncontrolledInitialValue(${WrappedComponent.displayName || "Component"})`;

    return Injected;
};
