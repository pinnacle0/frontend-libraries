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

    constructor(props: Props) {
        super(props);
        this.state = {
            elapsedText: "-",
        };
    }

    componentDidMount() {
        this.repaint();
    }

    componentDidUpdate(prevProps: Readonly<Props>) {
        if (prevProps.date !== this.props.date) {
            this.repaint();
        }
    }

    componentWillUnmount() {
        clearTimeout(this.repaintTimeout);
    }

    repaint = () => {
        clearTimeout(this.repaintTimeout);

        const momentLocale = LocaleUtil.current() === "zh" ? "zh-cn" : "en";
        const propsMoment = moment(this.props.date).locale(momentLocale);
        const currentMoment = moment();
        const elapsedText = propsMoment.from(currentMoment);
        this.setState({elapsedText});

        // Moment threshold uses 45 minutes for "an hour ago" and 45 seconds for "a minute ago".
        // Repaint after 15 minutes / seconds interval should be good enough for now.
        // See: https://momentjs.com/docs/#/displaying/fromnow/
        const isAnHourAgo = Date.now() - this.props.date.getTime() > 3600 * 1000;
        const timeoutDuration = isAnHourAgo ? 15 * 1000 * 60 : 15 * 1000;
        this.repaintTimeout = window.setTimeout(this.repaint, timeoutDuration);
    };

    render() {
        return this.state.elapsedText;
    }
}
