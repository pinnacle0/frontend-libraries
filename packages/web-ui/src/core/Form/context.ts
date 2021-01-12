import React from "react";
import type {TooltipPlacement} from "../Tooltip";

export type FormErrorDisplayMode = {type: "popover"; placement?: TooltipPlacement} | {type: "extra"};

export interface FormValidationContextType {
    registerValidator: (validator: () => Promise<boolean>) => void;
    unregisterValidator: (validator: () => Promise<boolean>) => void;
    errorDisplayMode: () => FormErrorDisplayMode;
}

export const FormValidationContext = React.createContext<FormValidationContextType>({
    registerValidator: () => {},
    unregisterValidator: () => {},
    errorDisplayMode: () => ({type: "extra"}),
});
