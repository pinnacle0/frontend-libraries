import React from "react";
import {Picker} from "@rc-component/picker";
import dayjsGenerateConfig from "@rc-component/picker/lib/generate/dayjs";
import dayjs from "dayjs";
import type {Dayjs} from "dayjs";
import type {ControlledFormValue} from "../../internal/type";
import en_US from "@rc-component/picker/lib/locale/en_US";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props<T extends boolean> extends ControlledFormValue<T extends false ? Date : Date | null> {
    allowNull: T;
    disabled?: boolean;
    className?: string;
    placeholder?: string;
    showNow?: boolean;
    disabledRange?: (diffHourToToday: number, date: Date) => boolean;
    preserveInvalidOnBlur?: boolean;
    showSecond?: boolean;
}

export const DateTimePicker = ReactUtil.memo("DateTimePicker", <T extends boolean>(props: Props<T>) => {
    const {value, allowNull, disabled, showNow, className, placeholder, showSecond, preserveInvalidOnBlur = true, disabledRange, onChange} = props;

    const isDateDisabled = (current: Dayjs): boolean => {
        if (!current) return false;
        if (current.valueOf() >= new Date(2038, 0).valueOf()) return true;
        const diffHourToToday = Math.floor(current.diff(dayjs().startOf("hour"), "hour", true));
        return disabledRange?.(diffHourToToday, current.toDate()) || false;
    };

    const onPickerChange = (date: Dayjs | null) => {
        const typedOnChange = onChange as (value: Date | null) => void;
        typedOnChange(date ? date.toDate() : null);
    };

    return (
        <Picker<Dayjs>
            generateConfig={dayjsGenerateConfig}
            locale={en_US}
            className={className}
            placeholder={placeholder}
            disabledDate={isDateDisabled}
            value={value ? dayjs(value) : null}
            onChange={onPickerChange as any}
            allowClear={allowNull}
            disabled={disabled}
            showTime
            showSecond={showSecond}
            showNow={showNow}
            preserveInvalidOnBlur={preserveInvalidOnBlur}
            needConfirm={false}
        />
    );
});
