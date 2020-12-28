import moment from "moment";
import React from "react";
import {LocaleUtil} from "../util/LocaleUtil";

export interface Props {
    date: Date;
}

interface State {
    elapsedText: string;
}

export class RelativeTime extends React.PureComponent<Props, State> {
    static displayName = "RelativeTime";

    private repaintTimeout: number | undefined;

    private timeoutDuration!: number;

    constructor(props: Props) {
        super(props);
        this.state = {
            elapsedText: "-",
        };
    }

    componentDidMount() {
        this.repaint();
    }

    componentWillUnmount() {
        if (this.repaintTimeout) {
            clearTimeout(this.repaintTimeout);
        }
    }

    getCurrentMoment = () => moment();

    repaint = () => {
        if (this.repaintTimeout) {
            clearTimeout(this.repaintTimeout);
        }
        const momentLocale = LocaleUtil.current() === "zh" ? "zh-cn" : "en";
        const propsMoment: moment.Moment = moment(this.props.date).locale(momentLocale);
        const currentMoment: moment.Moment = this.getCurrentMoment();
        const elapsedText: string = propsMoment.from(currentMoment);
        this.setState({elapsedText});

        const isAnHourAgo = Math.abs(propsMoment.diff(currentMoment, "m")) > moment.relativeTimeThreshold("m");

        // Moment threshold uses 45 minutes for "an hour ago" and 45 seconds for "a minute ago".
        // Repaint after 15 minutes / seconds interval should be good enough for now.
        // Refactor this later.
        // See: https://momentjs.com/docs/#/displaying/fromnow/
        if (isAnHourAgo) {
            const duration15MinutesInMilliseconds = moment(0).add(15, "m").valueOf();
            this.timeoutDuration = duration15MinutesInMilliseconds;
        } else {
            const duration15SecondsInMilliseconds = moment(0).add(15, "s").valueOf();
            this.timeoutDuration = duration15SecondsInMilliseconds;
        }
        this.repaintTimeout = setTimeout(this.repaint as Function, this.timeoutDuration);
    };

    render() {
        return <div>{this.state.elapsedText}</div>;
    }
}
