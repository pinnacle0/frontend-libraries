import React from "react";
import classNames from "classnames";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props {
    percent?: number;
    type?: "line" | "circle" | "dashboard";
    status?: "success" | "exception" | "normal" | "active";
    showInfo?: boolean;
    strokeColor?: string | string[];
    trailColor?: string;
    strokeWidth?: number;
    size?: "default" | "small" | number | [number, number];
    format?: (percent?: number, successPercent?: number) => React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    steps?: number;
    strokeLinecap?: "round" | "butt" | "square";
    successPercent?: number;
    width?: number;
}

const statusColors: Record<string, string> = {
    success: "#52c41a",
    exception: "#ff4d4f",
    normal: "#1677ff",
    active: "#1677ff",
};

export const Progress = ReactUtil.memo("Progress", (props: Props) => {
    const {
        percent = 0,
        type = "line",
        status = "normal",
        showInfo = true,
        strokeColor,
        trailColor = "#f5f5f5",
        strokeWidth,
        format,
        className,
        style,
        width: circleWidth = 120,
        strokeLinecap = "round",
        steps,
        size,
    } = props;

    const effectiveStatus = percent >= 100 && status === "normal" ? "success" : status;
    const color = strokeColor || statusColors[effectiveStatus] || "#1677ff";
    const gradientColor = Array.isArray(color) ? `linear-gradient(to right, ${color.join(", ")})` : color;
    const infoText = format ? format(percent) : `${Math.round(percent)}%`;
    const barHeight = strokeWidth || (typeof size === "number" ? size : size === "small" || (Array.isArray(size) && size[1]) ? (Array.isArray(size) ? size[1] : 6) : 8);

    if (type === "circle" || type === "dashboard") {
        const r = (circleWidth - (strokeWidth || 6)) / 2;
        const circumference = 2 * Math.PI * r;
        const dashLen = type === "dashboard" ? circumference * 0.75 : circumference;
        const offset = dashLen * (1 - percent / 100);
        const rotation = type === "dashboard" ? 135 : -90;

        return (
            <div className={classNames("g-progress", className)} style={{width: circleWidth, height: circleWidth, display: "inline-flex", position: "relative", ...style}}>
                <svg viewBox={`0 0 ${circleWidth} ${circleWidth}`} width={circleWidth} height={circleWidth}>
                    <circle
                        cx={circleWidth / 2}
                        cy={circleWidth / 2}
                        r={r}
                        fill="none"
                        stroke={trailColor}
                        strokeWidth={strokeWidth || 6}
                        strokeLinecap={strokeLinecap}
                        strokeDasharray={`${dashLen} ${circumference}`}
                        transform={`rotate(${rotation} ${circleWidth / 2} ${circleWidth / 2})`}
                    />
                    <circle
                        cx={circleWidth / 2}
                        cy={circleWidth / 2}
                        r={r}
                        fill="none"
                        stroke={typeof color === "string" ? color : "#1677ff"}
                        strokeWidth={strokeWidth || 6}
                        strokeLinecap={strokeLinecap}
                        strokeDasharray={`${dashLen} ${circumference}`}
                        strokeDashoffset={offset}
                        transform={`rotate(${rotation} ${circleWidth / 2} ${circleWidth / 2})`}
                        style={{transition: "stroke-dashoffset 0.3s"}}
                    />
                </svg>
                {showInfo && <span style={{position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: circleWidth * 0.15 + 6}}>{infoText}</span>}
            </div>
        );
    }

    if (steps) {
        return (
            <div className={classNames("g-progress", className)} style={{display: "inline-flex", alignItems: "center", gap: 2, ...style}}>
                {Array.from({length: steps}).map((_, i) => (
                    <div
                        key={i}
                        style={{
                            width: 14,
                            height: barHeight,
                            borderRadius: strokeLinecap === "round" ? barHeight / 2 : 0,
                            background: i < Math.round((percent / 100) * steps) ? (typeof color === "string" ? color : "#1677ff") : trailColor,
                        }}
                    />
                ))}
                {showInfo && <span style={{marginLeft: 8, fontSize: 14}}>{infoText}</span>}
            </div>
        );
    }

    return (
        <div className={classNames("g-progress", className)} style={{display: "flex", alignItems: "center", ...style}}>
            <div style={{flex: 1, height: barHeight, background: trailColor, borderRadius: strokeLinecap === "round" ? barHeight / 2 : 0, overflow: "hidden"}}>
                <div
                    style={{
                        width: `${Math.min(percent, 100)}%`,
                        height: "100%",
                        background: gradientColor,
                        borderRadius: strokeLinecap === "round" ? barHeight / 2 : 0,
                        transition: "width 0.3s",
                    }}
                />
            </div>
            {showInfo && <span style={{marginLeft: 8, fontSize: 14, whiteSpace: "nowrap"}}>{infoText}</span>}
        </div>
    );
});
