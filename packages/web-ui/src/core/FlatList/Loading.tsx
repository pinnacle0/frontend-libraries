import React from "react";
import {Spin} from "../Spin";

interface Props {
    loading: boolean;
    message?: string;
}

const throttle = (ms: number, callback: (...args: any[]) => void) => {
    let canRun = true;
    setTimeout(() => {
        canRun = true;
    }, ms);

    return function (...args: any[]) {
        if (canRun) {
            canRun = false;
            callback(...args);
        }
    };
};

const useThrottle = (ms: number, callback: (...args: any[]) => void) => {
    const callbackRef = React.useRef(callback);
    callbackRef.current = callback;
    const runner = React.useMemo(() => throttle(ms, callbackRef.current), [ms]);

    return runner;
};

export const Loading = (props: Props) => {
    const {loading, message} = props;
    return (
        <div className="g-flat-list-loading">
            <div>
                <Spin spinning={loading} size="small" />
                {message ?? "Release to refresh"}
            </div>
        </div>
    );
};
