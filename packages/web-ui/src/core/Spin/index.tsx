import React from "react";
import classNames from "classnames";
import {LoadingOutlined} from "../../internal/icons";
import {ReactUtil} from "../../util/ReactUtil";

export type SpinSize = "small" | "default" | "large";
export type SpinIndicator = React.ReactElement;

export interface Props {
    spinning: boolean;
    size?: SpinSize;
    indicator?: SpinIndicator;
    tip?: React.ReactNode;
    delay?: number;
    wrapperClassName?: string;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

const sizeMap: Record<SpinSize, number> = {small: 14, default: 20, large: 32};

export const Spin = ReactUtil.memo("Spin", ({spinning, children, indicator, size = "default", tip, delay, wrapperClassName, className, style}: Props) => {
    const [show, setShow] = React.useState(delay ? false : spinning);

    React.useEffect(() => {
        if (!delay) {
            setShow(spinning);
            return;
        }
        if (spinning) {
            const timer = setTimeout(() => setShow(true), delay);
            return () => clearTimeout(timer);
        } else {
            setShow(false);
        }
    }, [spinning, delay]);

    const spinIndicator = indicator || <LoadingOutlined style={{fontSize: sizeMap[size]}} />;

    if (!children) {
        return show ? (
            <div className={classNames("g-spin", className)} style={{textAlign: "center", ...style}}>
                {spinIndicator}
                {tip && <div style={{marginTop: 8}}>{tip}</div>}
            </div>
        ) : null;
    }

    return (
        <div className={classNames("g-spin-container", wrapperClassName)} style={{position: "relative", ...style}}>
            {children}
            {show && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(255,255,255,0.65)",
                        zIndex: 4,
                    }}
                >
                    {spinIndicator}
                    {tip && <div style={{marginTop: 8}}>{tip}</div>}
                </div>
            )}
        </div>
    );
});
