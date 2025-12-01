import React from "react";
import {SlidingDigit} from "./SlidingDigit";
import {ReactUtil} from "../../util/ReactUtil";
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

export const Countdown = ReactUtil.memo("Countdown", (props: Props) => {
    const {timeToComplete, onComplete, onTick, renderer, isHidden, className, style} = props;

    const computeRemainingSecond = () => {
        if (timeToComplete <= 0) return 0;
        return Math.ceil((timeToComplete - Date.now()) / 1000);
    };

    const [remainingSecond, setRemainingSecond] = React.useState(computeRemainingSecond());
    const isTimerCompleted = React.useRef(false);

    React.useEffect(() => {
        const timer = setInterval(handleTick, 1000);
        return () => clearInterval(timer);
    });

    React.useEffect(() => {
        isTimerCompleted.current = false;
    }, [timeToComplete]);

    const handleTick = () => {
        if (!isTimerCompleted.current && timeToComplete > 0) {
            const newRemainingSecond = computeRemainingSecond();
            if (newRemainingSecond <= 0) {
                isTimerCompleted.current = true; // To avoid call onComplete more than once
                onComplete?.();
            } else if (newRemainingSecond !== remainingSecond) {
                setRemainingSecond(newRemainingSecond);
                onTick?.(newRemainingSecond);
            }
        }
    };

    return isHidden ? null : (
        <div className={`g-countdown ${className || ""}`} style={style}>
            {BodyNode(timeToComplete, remainingSecond, renderer)}
        </div>
    );
});

const BodyNode = (timeToComplete: number, remainingSecond: number, renderer?: (hours: string, minutes: string, seconds: string, remainingSecond: number | null) => React.ReactElement | string) => {
    const bodyRenderer =
        renderer ||
        ((hours, minutes, seconds) => (
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
        ));

    if (timeToComplete <= 0) return bodyRenderer("--", "--", "--", null);

    if (remainingSecond / 3600 >= 100) {
        return bodyRenderer("99", "59", "59", remainingSecond);
    } else if (remainingSecond <= 0) {
        return bodyRenderer("00", "00", "00", 0);
    } else {
        const hours = Math.floor(remainingSecond / 3600)
            .toString()
            .padStart(2, "0");
        const remainingSecondWithinHour = remainingSecond % 3600;
        const minutes = Math.floor(remainingSecondWithinHour / 60)
            .toString()
            .padStart(2, "0");
        const seconds = (remainingSecondWithinHour % 60).toString().padStart(2, "0");
        return bodyRenderer(hours, minutes, seconds, remainingSecond);
    }
};
