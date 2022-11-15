export type PickOptional<T> = Pick<T, {[K in keyof T]-?: {} extends {[P in K]: T[K]} ? K : never}[keyof T]>;
export type StringKey<T extends object> = {[P in keyof T]: T[P] extends string ? P : never}[keyof T] & string;

export interface ControlledFormValue<T> {
    value: T;
    onChange: (value: T) => void;
}
