import React from "react";
import dayjs from "dayjs";
import generateCalendar from "antd/es/calendar/generateCalendar";
import dayjsGenerateConfig from "rc-picker/lib/generate/dayjs";
import localeData from "dayjs/plugin/localeData";
import {Select} from "./Select";
import {Space} from "./Space";
import type {ControlledFormValue} from "../internal/type";
import type {HeaderRender} from "antd/es/calendar/generateCalendar";
import type {Dayjs} from "dayjs";

// load plugin when component is imported
dayjs.extend(localeData);

const AntCalendar = generateCalendar<Dayjs>(dayjsGenerateConfig);

export interface Props extends ControlledFormValue<string> {}

export class DateCalendar extends React.PureComponent<Props> {
    static displayName = "DateCalendar";

    private readonly headerStyle: React.CSSProperties = {padding: 8};

    private readonly now = dayjs();

    isDateDisabled = (current: Dayjs): boolean => {
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

    onChange = (date: Dayjs) => this.props.onChange(dayjs(date).format("YYYY-MM-DD"));

    renderHeader: HeaderRender<Dayjs> = ({value, onChange}) => {
        const start = 0;
        const end = 12;
        const monthOptions = [];

        const localeData = this.now.localeData();
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
        const yearOfNow = this.now.year();
        const options = [];

        for (let i = yearOfNow - 100; i <= yearOfNow; i++) {
            options.push(
                <Select.Option key={i} value={i}>
                    {i}
                </Select.Option>
            );
        }

        return (
            <div style={this.headerStyle}>
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

    render() {
        return <AntCalendar disabledDate={this.isDateDisabled} headerRender={this.renderHeader} value={dayjs(this.props.value, "YYYY-MM-DD")} fullscreen={false} onChange={this.onChange} />;
    }
}
