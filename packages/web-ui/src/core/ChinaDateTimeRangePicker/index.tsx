import React from "react";
import type {Dayjs} from "dayjs";
import type {ControlledFormValue} from "../../internal/type";
import "./index.less";
import {dayjs, TIMEZONE} from "../../util/DayJS";
import {ChinaAntDatePicker} from "../../internal/ChinaAntDatePicker";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props<T extends boolean> extends ControlledFormValue<T extends false ? [Date, Date] : [Date | null, Date | null]> {
    allowNull: T;
    disabled?: boolean;
    className?: string;
    disabledRange?: (diffToToday: number, date: Date) => boolean;
    presets?: Array<{label: React.ReactNode; value: [Dayjs, Dayjs] | (() => [Dayjs, Dayjs])}>;
    preserveInvalidOnBlur?: boolean;
    showSecond?: boolean;
}

/**
 * Same as `DateTimeRangePicker`, but always displays and interprets date-times in Beijing time
 * (UTC+8) regardless of the viewer's machine timezone. The stored values are the same absolute `Date` instants.
 */
export const ChinaDateTimeRangePicker = ReactUtil.memo("ChinaDateTimeRangePicker", <T extends boolean>(props: Props<T>) => {
    const {value, allowNull, disabled, className, presets, showSecond, preserveInvalidOnBlur = true, disabledRange, onChange} = props;
    const [shouldCheckDateRangeValid, setShouldCheckDateRangeValid] = React.useState(false);

    React.useEffect(() => {
        if (shouldCheckDateRangeValid && value[0] && value[1]) {
            const typedOnChange = onChange as (value: [Date | null, Date | null]) => void;
            if (dayjs(value[0]).isAfter(dayjs(value[1]))) {
                typedOnChange([value[1], value[0]]);
            }
            setShouldCheckDateRangeValid(false);
        }
    }, [shouldCheckDateRangeValid, value, onChange]);

    const isDateDisabled = (current: Dayjs): boolean => {
        if (!current) return false;
        /**
         * This is for compatibility of MySQL.
         * MySQL TIMESTAMP data type is used for values that contain both date and time parts.
         * TIMESTAMP has a range of '1970-01-01 00:00:01' UTC to '2038-01-19 03:14:07' UTC.
         */
        if (current.valueOf() >= new Date(2038, 0).valueOf()) return true;

        const diffToToday = Math.floor(current.diff(dayjs().tz(TIMEZONE).startOf("day"), "day", true));
        return disabledRange?.(diffToToday, current.toDate()) || false;
    };

    const onAntChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
        const typedOnChange = onChange as (value: [Date | null, Date | null]) => void;
        if (dates) {
            // need manually reset the min/max millisecond
            // otherwise, from/to will use now's millisecond value, which is inaccurate
            const start = dates[0];
            const end = dates[1];
            const from = start ? start.millisecond(0).toDate() : null;
            const to = end ? end.millisecond(999).toDate() : null;
            typedOnChange([from, to]);
        } else {
            typedOnChange([null, null]);
        }
    };

    const onOpenChange = (open: boolean) => {
        setShouldCheckDateRangeValid(!open);
    };

    return (
        <ChinaAntDatePicker.RangePicker
            className={className}
            value={[value[0] ? dayjs(value[0]).tz(TIMEZONE) : null, value[1] ? dayjs(value[1]).tz(TIMEZONE) : null]}
            onCalendarChange={onAntChange}
            disabledDate={isDateDisabled}
            allowClear={allowNull}
            disabled={disabled}
            presets={presets}
            showTime={{defaultValue: [dayjs().tz(TIMEZONE).startOf("day"), dayjs().tz(TIMEZONE).endOf("day")]}}
            showSecond={showSecond}
            preserveInvalidOnBlur={preserveInvalidOnBlur}
            onOpenChange={onOpenChange}
            needConfirm={false}
        />
    );
});
