import React from "react";
import type {Dayjs} from "dayjs";
import dayjs from "dayjs";
import type {ControlledFormValue} from "../../internal/type";
import {RangePicker} from "@rc-component/picker";
import dayjsGenerateConfig from "@rc-component/picker/lib/generate/dayjs";
import en_US from "@rc-component/picker/lib/locale/en_US";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props<T extends boolean> extends ControlledFormValue<T extends false ? [string, string] : [string | null, string | null]> {
    allowNull: T;
    disabledRange?: (diffToToday: number, date: Date) => boolean;
    disabled?: boolean;
    className?: string;
    presets?: Array<{label: React.ReactNode; value: [Dayjs, Dayjs] | (() => [Dayjs, Dayjs])}>;
    preserveInvalidOnBlur?: boolean;
}

const DATE_FORMATTER = "YYYY-MM-DD";

export const DateRangePicker = ReactUtil.memo("DateRangePicker", <T extends boolean>(props: Props<T>) => {
    const {value, allowNull, disabledRange, disabled, className, presets, preserveInvalidOnBlur = true, onChange} = props;
    const [shouldCheckDateRangeValid, setShouldCheckDateRangeValid] = React.useState(false);

    React.useEffect(() => {
        if (shouldCheckDateRangeValid && value[0] && value[1]) {
            const typedOnChange = onChange as (value: [string | null, string | null]) => void;
            if (dayjs(value[0]).isAfter(dayjs(value[1]))) {
                typedOnChange([value[1], value[0]]);
            }
            setShouldCheckDateRangeValid(false);
        }
    }, [shouldCheckDateRangeValid, value, onChange]);

    const isDateDisabled = (current: Dayjs): boolean => {
        if (!current) return false;
        if (current.valueOf() >= new Date(2038, 0).valueOf()) return true;
        const diffToToday = Math.floor(current.diff(dayjs().startOf("day"), "day", true));
        return disabledRange?.(diffToToday, current.toDate()) || false;
    };

    const onRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
        const typedOnChange = onChange as (value: [string | null, string | null]) => void;
        if (dates) {
            const start = dates[0];
            const end = dates[1];
            typedOnChange([start ? start.format(DATE_FORMATTER) : null, end ? end.format(DATE_FORMATTER) : null]);
        } else {
            typedOnChange([null, null]);
        }
    };

    const onOpenChange = (open: boolean) => {
        setShouldCheckDateRangeValid(!open);
    };

    return (
        <RangePicker<Dayjs>
            generateConfig={dayjsGenerateConfig}
            locale={en_US}
            disabledDate={isDateDisabled}
            className={className}
            showTime={false}
            value={[value[0] ? dayjs(value[0]) : null, value[1] ? dayjs(value[1]) : null]}
            onCalendarChange={onRangeChange}
            allowClear={allowNull}
            disabled={disabled}
            presets={presets}
            preserveInvalidOnBlur={preserveInvalidOnBlur}
            onOpenChange={onOpenChange}
        />
    );
});
