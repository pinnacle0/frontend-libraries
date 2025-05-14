import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// load plugin when component is imported
dayjs.extend(relativeTime);

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

        const elapsedText = dayjs(this.props.date).fromNow();
        this.setState({elapsedText});
        /**
         * dayjs relative time plugin uses 45 minutes for "an hour ago" threshold and 45 seconds for "a minute ago" threshold.
         * Repaint after 15 minutes / seconds interval should be good enough for now.
         * See: https://day.js.org/docs/en/customization/relative-time
         */
        const isAnHourAgo = Date.now() - this.props.date.getTime() > 3600 * 1000;
        const timeoutDuration = isAnHourAgo ? 15 * 1000 * 60 : 15 * 1000;
        this.repaintTimeout = window.setTimeout(this.repaint, timeoutDuration);
    };

    render() {
        return this.state.elapsedText;
    }
}
