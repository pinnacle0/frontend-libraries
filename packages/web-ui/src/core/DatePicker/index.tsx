import React from "react";
import {Picker} from "@rc-component/picker";
import "@rc-component/picker/assets/index.less";
import dayjsGenerateConfig from "@rc-component/picker/lib/generate/dayjs";
import type {Dayjs} from "dayjs";
import dayjs from "dayjs";
import type {ControlledFormValue} from "../../internal/type";
import en_US from "@rc-component/picker/lib/locale/en_US";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props<T extends boolean> extends ControlledFormValue<T extends false ? string : string | null> {
    allowNull: T;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
    preserveInvalidOnBlur?: boolean;
}

export const DatePicker = ReactUtil.memo("DatePicker", <T extends boolean>(props: Props<T>) => {
    const {value, allowNull, placeholder, disabled, className, preserveInvalidOnBlur = true, onChange} = props;

    const isDateDisabled = (current: Dayjs): boolean => {
        if (!current) return false;
        return current.valueOf() >= new Date(2038, 0).valueOf();
    };

    const onPickerChange = (_date: Dayjs | null, dateString: string | string[]) => {
        const str = Array.isArray(dateString) ? dateString[0] : dateString;
        if (str || allowNull) {
            const typedOnChange = onChange as (value: string | null) => void;
            typedOnChange(str || null);
        }
    };

    return (
        <Picker<Dayjs>
            generateConfig={dayjsGenerateConfig}
            locale={en_US}
            className={className}
            picker="date"
            showTime={false}
            disabledDate={isDateDisabled}
            placeholder={placeholder}
            value={value ? dayjs(value) : null}
            onChange={onPickerChange as any}
            allowClear={allowNull}
            disabled={disabled}
            preserveInvalidOnBlur={preserveInvalidOnBlur}
        />
    );
});
