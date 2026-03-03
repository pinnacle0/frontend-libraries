import React from "react";
import classNames from "classnames";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props {
    count?: number;
    overflowCount?: number;
    dot?: boolean;
    showZero?: boolean;
    offset?: [number, number];
    size?: "default" | "small";
    color?: string;
    status?: "success" | "processing" | "default" | "error" | "warning";
    text?: React.ReactNode;
    title?: string;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

const supStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    insetInlineEnd: 0,
    transform: "translate(50%, -50%)",
    transformOrigin: "100% 0%",
    fontSize: 12,
    lineHeight: "20px",
    height: 20,
    minWidth: 20,
    padding: "0 6px",
    borderRadius: 10,
    background: "#ff4d4f",
    color: "#fff",
    textAlign: "center",
    whiteSpace: "nowrap",
    boxShadow: "0 0 0 1px #fff",
    zIndex: 1,
};

const dotStyle: React.CSSProperties = {
    ...supStyle,
    width: 8,
    height: 8,
    minWidth: 8,
    padding: 0,
    borderRadius: "50%",
};

export const Badge = ReactUtil.memo("Badge", (props: Props) => {
    const {count = 0, overflowCount = 99, dot, showZero, offset, size, color, status, text, title, className, style, children} = props;

    const hasCount = count > 0 || showZero;
    const displayCount = count > overflowCount ? `${overflowCount}+` : count;

    if (status || (!children && !dot && !hasCount)) {
        const statusDot: React.CSSProperties = {
            width: 6,
            height: 6,
            borderRadius: "50%",
            display: "inline-block",
            marginRight: text ? 8 : 0,
            background: color || (status === "success" ? "#52c41a" : status === "error" ? "#ff4d4f" : status === "warning" ? "#faad14" : status === "processing" ? "#1677ff" : "#d9d9d9"),
        };
        return (
            <span className={classNames("g-badge", className)} style={style}>
                <span style={statusDot} />
                {text && <span>{text}</span>}
            </span>
        );
    }

    const offsetStyle: React.CSSProperties = offset ? {marginTop: offset[1], right: -offset[0]} : {};

    return (
        <span className={classNames("g-badge", className)} style={{position: "relative", display: "inline-flex", ...style}}>
            {children}
            {dot && <span style={{...dotStyle, ...(color ? {background: color} : {}), ...(size === "small" ? {width: 6, height: 6, minWidth: 6} : {}), ...offsetStyle}} title={title} />}
            {!dot && hasCount && (
                <sup
                    style={{
                        ...supStyle,
                        ...(color ? {background: color} : {}),
                        ...(size === "small" ? {fontSize: 10, lineHeight: "16px", height: 16, minWidth: 16, padding: "0 4px"} : {}),
                        ...offsetStyle,
                    }}
                    title={title || String(count)}
                >
                    {displayCount}
                </sup>
            )}
        </span>
    );
});
