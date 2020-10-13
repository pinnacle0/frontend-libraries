import React from "react";

export type SafeReactChild = React.ReactChild | boolean | null;
export type SafeReactChildren = SafeReactChild | SafeReactChild[];
export type PickOptional<T> = Pick<T, {[K in keyof T]-?: {} extends {[P in K]: T[K]} ? K : never}[keyof T]>;

export interface ControlledFormValue<T> {
    value: T;
    onChange: (value: T) => void;
}
