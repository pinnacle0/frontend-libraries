import React from "react";
import type {PickOptional} from "../../internal/type";
import {SlidingDigit} from "./SlidingDigit";
import "./index.less";

export interface Props {
    /**
     * Pass 0 or negative will invalidate the time into --:--:--.
     */
    timeToComplete: number;
    onComplete?: () => void;
    /**
     * @param remainingSecond - positive ONLY, use `onComplete` for remaining second is 0
     */
    onTick?: (remainingSecond: number) => void;
    /**
     * @param hours/minutes/seconds - well-formatted in exact two chars
     * @param remainingSecond - NULL if not applicable
     */
    renderer?: (hours: string, minutes: string, seconds: string, remainingSecond: number | null) => React.ReactElement | string;
    isHidden?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

interface State {
    remainingSecond: number;
}

export class Countdown extends React.PureComponent<Props, State> {
    static displayName = "Countdown";
    static defaultProps: PickOptional<Props> = {
        renderer: (hours, minutes, seconds) => (
            <React.Fragment>
                <SlidingDigit digit={hours.charAt(0)} />
                <SlidingDigit digit={hours.charAt(1)} />
                <div className="colon">:</div>
                <SlidingDigit digit={minutes.charAt(0)} />
                <SlidingDigit digit={minutes.charAt(1)} />
                <div className="colon">:</div>
                <SlidingDigit digit={seconds.charAt(0)} />
                <SlidingDigit digit={seconds.charAt(1)} />
            </React.Fragment>
        ),
    };

    private timer!: number;
    private isTimerCompleted = false;

    constructor(props: Props) {
        super(props);
        this.state = {remainingSecond: this.computeRemainingSecond()};
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
        const {timeToComplete, onComplete, onTick} = this.props;
        if (!this.isTimerCompleted && timeToComplete > 0) {
            const remainingSecond = this.computeRemainingSecond();
            if (remainingSecond <= 0) {
                this.isTimerCompleted = true; // To avoid call onComplete more than once
                onComplete?.();
            } else if (remainingSecond !== this.state.remainingSecond) {
                this.setState({remainingSecond}, () => onTick?.(remainingSecond));
            }
        }
    };

    render() {
        const {isHidden, renderer, timeToComplete, className, style} = this.props;
        const {remainingSecond} = this.state;
        if (isHidden) {
            return null;
        }

        let bodyNode: React.ReactElement | string;
        if (timeToComplete > 0) {
            if (remainingSecond / 3600 >= 100) {
                bodyNode = renderer!("99", "59", "59", remainingSecond);
            } else if (remainingSecond <= 0) {
                bodyNode = renderer!("00", "00", "00", 0);
            } else {
                const hours = Math.floor(remainingSecond / 3600)
                    .toString()
                    .padStart(2, "0");
                const remainingSecondWithinHour = remainingSecond % 3600;
                const minutes = Math.floor(remainingSecondWithinHour / 60)
                    .toString()
                    .padStart(2, "0");
                const seconds = (remainingSecondWithinHour % 60).toString().padStart(2, "0");
                bodyNode = renderer!(hours, minutes, seconds, remainingSecond);
            }
        } else {
            bodyNode = renderer!("--", "--", "--", null);
        }

        return (
            <div className={`g-countdown ${className || ""}`} style={style}>
                {bodyNode}
            </div>
        );
    }
}
