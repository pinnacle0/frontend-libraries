import type React from "react";

export type SafeReactChild = React.ReactChild | boolean | null;
export type SafeReactChildren = SafeReactChild | SafeReactChild[];

export type MarkAsOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type PickOptional<T> = Pick<T, {[K in keyof T]-?: {} extends {[P in K]: T[K]} ? K : never}[keyof T]>;
export type StringKey<T extends object> = {[P in keyof T]: T[P] extends string ? P : never}[keyof T] & string;

export interface ControlledFormValue<T> {
    value: T;
    onChange: (value: T) => void;
}
