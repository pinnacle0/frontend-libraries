import RcSelect from "@rc-component/select";
import type {SelectProps as RcSelectProps} from "@rc-component/select";
import React from "react";
import {ReactUtil} from "../../util/ReactUtil";
import classNames from "classnames";
// import "@rc-component/select/assets/index.less";
import "./index.less";

export type SelectValue = string | number | string[] | number[];

export interface SelectOptionProps {
    value?: string | number;
    label?: React.ReactNode;
    disabled?: boolean;
    title?: string | null;
    className?: string;
    children?: React.ReactNode;
}

export interface DefaultOptionType {
    value?: string | number;
    label?: React.ReactNode;
    disabled?: boolean;
    children?: DefaultOptionType[];
    [key: string]: any;
}

export interface Props<ValueType extends SelectValue> extends Omit<RcSelectProps<ValueType>, "options"> {
    options?: Array<DefaultOptionType>;
    dropdownStyle?: React.CSSProperties;
}

const Option = RcSelect.Option;
const OptGroup = RcSelect.OptGroup;

const InternalSelect = ReactUtil.memo("Select", <ValueType extends SelectValue>(props: Props<ValueType>) => {
    const {open: propOpen, onPopupVisibleChange: propOnPopupVisibleChange, className, ...restProps} = props;
    const [open, setOpen] = React.useState<boolean | undefined>(undefined);

    const handlePopupVisibleChange = React.useCallback(
        (nextOpen: boolean) => {
            propOpen === undefined && setOpen(nextOpen);
            propOnPopupVisibleChange?.(nextOpen);
        },
        [propOnPopupVisibleChange, propOpen]
    );

    const openValue = propOpen ?? open;
    return <RcSelect {...restProps} className={classNames("g-select", className)} open={openValue} onPopupVisibleChange={handlePopupVisibleChange} />;
});

export const Select: typeof InternalSelect & {Option: typeof Option; OptGroup: typeof OptGroup} = Object.assign(InternalSelect, {Option, OptGroup});
