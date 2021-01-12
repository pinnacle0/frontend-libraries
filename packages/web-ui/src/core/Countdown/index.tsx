import React from "react";
import {SlidingDigit} from "./SlidingDigit";
import type {PickOptional} from "../../internal/type";
import "./index.less";

export interface Props {
    /**
     * Use timeToComplete, instead of remainingSecond, to sync multiple Countdown correctly and easily.
     * Pass 0 or negative will invalidate the time into --:--:--.
     */
    timeToComplete: number;
    onComplete?: () => void;
    /**
     * @hours / @minutes / @seconds are well-formatted in exact two chars.
     * @remainingSecond will be null if not applicable.
     */
    renderer?: (hours: string, minutes: string, seconds: string, remainingSecond: number | null) => React.ReactElement | string;
    /**
     * If true, no UI element will show.
     * Useful for triggering event after some time, without displaying anything on UI.
     */
    isHidden?: boolean;
}

interface State {
    remainingSecond: number;
}

export class Countdown extends React.PureComponent<Props, State> {
    static displayName = "Countdown";
    static defaultProps: PickOptional<Props> = {
        renderer: (hours, minutes, seconds) => (
            <div className="g-countdown">
                <SlidingDigit digit={hours.charAt(0)} />
                <SlidingDigit digit={hours.charAt(1)} />
                <div className="colon">:</div>
                <SlidingDigit digit={minutes.charAt(0)} />
                <SlidingDigit digit={minutes.charAt(1)} />
                <div className="colon">:</div>
                <SlidingDigit digit={seconds.charAt(0)} />
                <SlidingDigit digit={seconds.charAt(1)} />
            </div>
        ),
    };

    private timer!: number;
    private isTimerCompleted = false;

    constructor(props: Props) {
        super(props);
        this.state = {
            remainingSecond: this.computeRemainingSecond(),
        };
    }

    componentDidMount() {
        this.timer = window.setInterval(this.onTick, 1000);
    }

    componentWillUnmount() {
        window.clearInterval(this.timer);
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.timeToComplete !== this.props.timeToComplete) {
            this.isTimerCompleted = false;
        }
    }

    computeRemainingSecond = () => {
        const {timeToComplete} = this.props;
        if (timeToComplete > 0) {
            return Math.ceil((timeToComplete - Date.now()) / 1000);
        } else {
            return 0;
        }
    };

    onTick = () => {
        const {timeToComplete, onComplete} = this.props;
        if (!this.isTimerCompleted && timeToComplete > 0) {
            const remainingSecond = this.computeRemainingSecond();
            if (remainingSecond <= 0) {
                this.isTimerCompleted = true; // To avoid call onComplete more than once
                onComplete?.();
            } else {
                this.setState({remainingSecond});
            }
        }
    };

    render() {
        const {isHidden, renderer, timeToComplete} = this.props;
        const {remainingSecond} = this.state;
        if (isHidden) {
            return null;
        }

        if (timeToComplete > 0) {
            // Special cases
            if (remainingSecond / 3600 >= 100) {
                return renderer!("99", "59", "59", remainingSecond);
            }
            if (remainingSecond <= 0) {
                return renderer!("00", "00", "00", 0);
            }

            const hours = Math.floor(remainingSecond / 3600)
                .toString()
                .padStart(2, "0");
            const remainingSecondWithinHour = remainingSecond % 3600;
            const minutes = Math.floor(remainingSecondWithinHour / 60)
                .toString()
                .padStart(2, "0");
            const seconds = (remainingSecondWithinHour % 60).toString().padStart(2, "0");
            return renderer!(hours, minutes, seconds, remainingSecond);
        } else {
            return renderer!("--", "--", "--", null);
        }
    }
}
