import type React from "react";

export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType[number];

export type PickOptional<T> = Pick<T, {[K in keyof T]-?: {} extends {[P in K]: T[K]} ? K : never}[keyof T]>;
export type PickNonNullable<T> = Pick<T, NonNullableKeys<T>>;

export type KeysOfType<T, ExpectedValueType> = {[P in keyof T]: T[P] extends ExpectedValueType ? P : never}[keyof T];
export type NullableKeys<T> = {[K in keyof T]: T[K] extends NonNullable<T[K]> ? never : K}[keyof T];
export type NonNullableKeys<T> = {[K in keyof T]: T[K] extends NonNullable<T[K]> ? K : never}[keyof T];

export type MarkAsNonNullable<T, K extends keyof T> = Omit<T, K> & {[P in K]: NonNullable<T[P]>};
/**
 * @desc Return an interface where optionals are not allowed
 */
export type MarkAsRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
export type MarkAsOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type MarkAsNullable<T, K extends keyof T> = Omit<T, K> & {[P in K]: T[P] | null};

/**
 * @desc Return an interface where optional, nullable and undefinable are not allowed
 */
export type StrictRequired<T> = {[K in keyof T]-?: Exclude<T[K], null | undefined>};

// TODO/Alvis: removed later, with eslint rules, web-ui internal
export type SafeReactChild = React.ReactChild | boolean | null;
export type SafeReactChildren = SafeReactChild | SafeReactChild[];

export interface ControlledFormValue<T> {
    value: T;
    onChange: (newValue: T) => void;
}
