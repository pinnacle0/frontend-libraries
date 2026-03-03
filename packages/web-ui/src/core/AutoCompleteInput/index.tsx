import RcSelect from "@rc-component/select";
import React from "react";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props {
    options?: Array<{value: string; label?: React.ReactNode}>;
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    onSearch?: (value: string) => void;
    onSelect?: (value: string, option: {value: string; label?: React.ReactNode}) => void;
    placeholder?: string;
    disabled?: boolean;
    allowClear?: boolean;
    defaultActiveFirstOption?: boolean;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    filterOption?: boolean | ((inputValue: string, option: any) => boolean);
    notFoundContent?: React.ReactNode;
    backfill?: boolean;
    open?: boolean;
    onDropdownVisibleChange?: (open: boolean) => void;
}

export const AutoCompleteInputOption = RcSelect.Option;

export const AutoCompleteInput = ReactUtil.memo("AutoCompleteInput", (props: Props) => {
    return <RcSelect mode="combobox" {...props} />;
});
