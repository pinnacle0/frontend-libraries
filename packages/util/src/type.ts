import React from "react";

export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType[number];

export type PickOptional<T> = Pick<T, {[K in keyof T]-?: {} extends {[P in K]: T[K]} ? K : never}[keyof T]>;
export type PickNonNullable<T> = Pick<T, NonNullableKeys<T>>;

export type KeysOfType<T, ExpectedValueType> = {[P in keyof T]: T[P] extends ExpectedValueType ? P : never}[keyof T];
export type NullableKeys<T> = {[K in keyof T]: T[K] extends NonNullable<T[K]> ? never : K}[keyof T];
export type NonNullableKeys<T> = {[K in keyof T]: T[K] extends NonNullable<T[K]> ? K : never}[keyof T];

// TODO/Jamyth: MarkAsRequired
export type RequireFields<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
// TODO/Jamyth: add some test cases
export type MarkAsOptional<T, K extends keyof T> = {[P in K]+?: T[P]} & {[P in Exclude<keyof T, K>]: T[P]};

export type SafeReactChild = React.ReactChild | boolean | null;
export type SafeReactChildren = SafeReactChild | SafeReactChild[];

export interface ControlledFormValue<T> {
    value: T;
    onChange: (newValue: T) => void;
}
