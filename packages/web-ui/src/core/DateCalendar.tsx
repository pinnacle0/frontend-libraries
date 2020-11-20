import React from "react";
import AntCalendar from "antd/lib/calendar";
import {HeaderRender} from "antd/lib/calendar/generateCalendar";
import moment, {Moment} from "moment";
import {ControlledFormValue} from "../internal/type";
import Select from "antd/lib/select";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import "antd/lib/calendar/style/css";
import "antd/lib/row/style/css";
import "antd/lib/col/style/css";

interface Props extends ControlledFormValue<string> {}

export class DateCalendar extends React.PureComponent<Props> {
    static displayName = "DateCalendar";

    isDateDisabled = (current: moment.Moment | null): boolean => {
        /**
         * This is for compatibility of MySQL.
         * MySQL TIMESTAMP data type is used for values that contain both date and time parts.
         * TIMESTAMP has a range of '1970-01-01 00:00:01' UTC to '2038-01-19 03:14:07' UTC.
         */
        if (current && current.valueOf() >= new Date(2038, 0).valueOf()) {
            return true;
        }
        return false;
    };

    onChange = (date: Moment) => this.props.onChange(moment(date).format("YYYY-MM-DD"));

    renderHeader: HeaderRender<Moment> = ({value, onChange}) => {
        const start = 0;
        const end = 12;
        const monthOptions = [];

        const current = value.clone();
        const localeData = value.localeData();
        const months = [];
        for (let i = 0; i < 12; i++) {
            current.month(i);
            months.push(localeData.monthsShort(current));
        }

        for (let index = start; index < end; index++) {
            monthOptions.push(
                <Select.Option value={1} key={`${index}`}>
                    {months[index]}
                </Select.Option>
            );
        }
        const month = value.month();

        const year = value.year();
        const options = [];
        for (let i = year - 10; i < year + 10; i += 1) {
            options.push(
                <Select.Option key={i} value={i}>
                    {i}
                </Select.Option>
            );
        }

        return (
            <div style={{padding: 8}}>
                <Row gutter={8}>
                    <Col>
                        <Select
                            size="small"
                            dropdownMatchSelectWidth={false}
                            onChange={newYear => {
                                const now = value.clone().year(Number(newYear));
                                onChange(now);
                            }}
                            value={String(year)}
                            suffixIcon={<React.Fragment>年</React.Fragment>}
                        >
                            {options}
                        </Select>
                    </Col>
                    <Col>
                        <Select
                            size="small"
                            dropdownMatchSelectWidth={false}
                            value={String(month)}
                            onChange={selectedMonth => {
                                const newValue = value.clone();
                                newValue.month(parseInt(selectedMonth, 10));
                                onChange(newValue);
                            }}
                            suffixIcon={<React.Fragment>月</React.Fragment>}
                        >
                            {monthOptions}
                        </Select>
                    </Col>
                </Row>
            </div>
        );
    };

    render() {
        return <AntCalendar disabledDate={this.isDateDisabled} headerRender={this.renderHeader} value={moment(this.props.value, "YYYY-MM-DD")} fullscreen={false} />;
    }
}
