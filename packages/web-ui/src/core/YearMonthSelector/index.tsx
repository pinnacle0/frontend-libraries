import React from "react";
import dayjs from "dayjs";
import {Picker} from "@rc-component/picker";
import dayjsGenerateConfig from "@rc-component/picker/lib/generate/dayjs";
import type {Dayjs} from "dayjs";
import type {ControlledFormValue} from "../../internal/type";
import arraySupport from "dayjs/plugin/arraySupport";
import en_US from "@rc-component/picker/lib/locale/en_US";
import {ReactUtil} from "../../util/ReactUtil";

dayjs.extend(arraySupport);

export interface Props<T extends boolean> extends ControlledFormValue<T extends false ? [number, number] : [number, number] | null> {
    allowNull: T;
    disabledRange?: (diffMonthToThisMonth: number, date: Date) => boolean;
    disabled?: boolean;
    className?: string;
}

export const YearMonthSelector = ReactUtil.memo("YearMonthSelector", <T extends boolean>({value, allowNull, disabled, className, disabledRange, onChange}: Props<T>) => {
    const isDateDisabled = (current: Dayjs): boolean => {
        if (!current) return false;
        if (current.valueOf() >= new Date(2038, 0).valueOf()) return true;
        const diffMonthToThisMonth = Math.floor(current.diff(dayjs().startOf("month"), "month", true));
        return disabledRange?.(diffMonthToThisMonth, current.toDate()) || false;
    };

    const onPickerChange = (date: Dayjs | null, dateString: string | string[]) => {
        const str = Array.isArray(dateString) ? dateString[0] : dateString;
        if (str || allowNull) {
            const typedOnChange = onChange as (value: [number, number] | null) => void;
            typedOnChange(date && [date.year(), date.month() + 1]);
        }
    };

    return (
        <Picker<Dayjs>
            generateConfig={dayjsGenerateConfig}
            locale={en_US}
            picker="month"
            className={className}
            disabledDate={isDateDisabled}
            value={value ? dayjs([value[0], value[1] - 1]) : null}
            onChange={onPickerChange as any}
            allowClear={allowNull}
            disabled={disabled}
        />
    );
});
