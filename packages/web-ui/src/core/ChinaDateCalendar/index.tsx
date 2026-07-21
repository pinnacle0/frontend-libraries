import React from "react";
import generateCalendar from "antd/es/calendar/generateCalendar";
import {Select} from "../Select";
import {Space} from "../Space";
import type {ControlledFormValue} from "../../internal/type";
import type {HeaderRender} from "antd/es/calendar/generateCalendar";
import type {Dayjs} from "dayjs";
import {dayjs, TIMEZONE} from "../../util/DayJS";
import {chinaDateConfig} from "../../internal/ChinaAntDatePicker";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props extends ControlledFormValue<string> {}

const AntCalendar = generateCalendar<Dayjs>(chinaDateConfig);
const headerStyle: React.CSSProperties = {padding: 8};

/**
 * Same as `DateCalendar`, but always displays and interprets dates in Beijing time (UTC+8)
 * regardless of the viewer's machine timezone. The stored value is the same `YYYY-MM-DD` string.
 */
export const ChinaDateCalendar = ReactUtil.memo("ChinaDateCalendar", ({value, onChange}: Props) => {
    const isDateDisabled = (current: Dayjs): boolean => {
        if (!current) {
            return false;
        }

        /**
         * This is for compatibility of MySQL.
         * MySQL TIMESTAMP data type is used for values that contain both date and time parts.
         * TIMESTAMP has a range of '1970-01-01 00:00:01' UTC to '2038-01-19 03:14:07' UTC.
         */
        if (current.valueOf() >= new Date(2038, 0).valueOf()) {
            return true;
        }
        return false;
    };

    const onAntChange = (date: Dayjs) => onChange(date.format("YYYY-MM-DD"));

    const renderHeader: HeaderRender<Dayjs> = ({value, onChange}) => {
        const start = 0;
        const end = 12;
        const monthOptions = [];
        const now = dayjs().tz(TIMEZONE);

        const localeData = now.localeData();
        const months = [];
        for (let i = 0; i < 12; i++) {
            months.push(localeData.monthsShort(value.month(i)));
        }

        for (let index = start; index < end; index++) {
            monthOptions.push(
                <Select.Option value={index} key={`${index}`}>
                    {months[index]}
                </Select.Option>
            );
        }

        const month = value.month();
        const year = value.year();
        const yearOfNow = now.year();
        const options = [];

        for (let i = yearOfNow - 100; i <= yearOfNow; i++) {
            options.push(
                <Select.Option key={i} value={i}>
                    {i}
                </Select.Option>
            );
        }

        return (
            <div style={headerStyle}>
                <Space>
                    <div>
                        <Select size="small" popupMatchSelectWidth={false} onChange={newYear => onChange(value.year(newYear))} value={year}>
                            {options}
                        </Select>
                    </div>
                    <div>
                        <Select size="small" popupMatchSelectWidth={false} value={month} onChange={selectedMonth => onChange(value.month(selectedMonth))}>
                            {monthOptions}
                        </Select>
                    </div>
                </Space>
            </div>
        );
    };

    return <AntCalendar disabledDate={isDateDisabled} headerRender={renderHeader} value={dayjs.tz(value, "YYYY-MM-DD", TIMEZONE)} fullscreen={false} onChange={onAntChange} />;
});
