import React from "react";
import classNames from "classnames";
import {ReactUtil} from "../../util/ReactUtil";

export interface StepItem {
    title?: React.ReactNode;
    subTitle?: React.ReactNode;
    description?: React.ReactNode;
    icon?: React.ReactNode;
    status?: "wait" | "process" | "finish" | "error";
    disabled?: boolean;
}

export interface Props {
    current?: number;
    initial?: number;
    status?: "wait" | "process" | "finish" | "error";
    size?: "default" | "small";
    direction?: "horizontal" | "vertical";
    type?: "default" | "navigation" | "inline";
    onChange?: (current: number) => void;
    items?: StepItem[];
    className?: string;
    style?: React.CSSProperties;
    labelPlacement?: "horizontal" | "vertical";
    percent?: number;
    responsive?: boolean;
}

const statusColors: Record<string, string> = {
    wait: "#00000040",
    process: "#1677ff",
    finish: "#1677ff",
    error: "#ff4d4f",
};

export const Steps = ReactUtil.memo("Steps", (props: Props) => {
    const {current = 0, initial = 0, status = "process", size, direction = "horizontal", onChange, items = [], className, style} = props;

    const getStatus = (index: number): string => {
        const adjustedIndex = index + initial;
        if (adjustedIndex < current) return "finish";
        if (adjustedIndex === current) return status;
        return "wait";
    };

    return (
        <div className={classNames("g-steps", className)} style={{display: "flex", flexDirection: direction === "vertical" ? "column" : "row", ...style}}>
            {items.map((item, i) => {
                const stepStatus = item.status || getStatus(i);
                const color = statusColors[stepStatus] || statusColors.wait;
                const isLast = i === items.length - 1;

                return (
                    <div
                        key={i}
                        style={{
                            flex: isLast && direction === "horizontal" ? "none" : 1,
                            display: "flex",
                            flexDirection: direction === "vertical" ? "column" : "row",
                            alignItems: direction === "vertical" ? "flex-start" : "center",
                            cursor: onChange && !item.disabled ? "pointer" : undefined,
                        }}
                        onClick={() => onChange && !item.disabled && onChange(i + initial)}
                    >
                        <div style={{display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap"}}>
                            <div
                                style={{
                                    width: size === "small" ? 24 : 32,
                                    height: size === "small" ? 24 : 32,
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: size === "small" ? 12 : 14,
                                    fontWeight: 600,
                                    ...(stepStatus === "process" ? {background: color, color: "#fff"} : {border: `1px solid ${color}`, color}),
                                }}
                            >
                                {item.icon || (stepStatus === "finish" ? "✓" : stepStatus === "error" ? "✕" : i + 1)}
                            </div>
                            <div>
                                <div
                                    style={{
                                        fontWeight: stepStatus === "process" ? 600 : 400,
                                        fontSize: size === "small" ? 14 : 16,
                                        color: stepStatus === "wait" ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0.88)",
                                    }}
                                >
                                    {item.title}
                                    {item.subTitle && <span style={{marginLeft: 8, fontWeight: 400, fontSize: 14, color: "rgba(0,0,0,0.45)"}}>{item.subTitle}</span>}
                                </div>
                                {item.description && <div style={{fontSize: 14, color: "rgba(0,0,0,0.45)"}}>{item.description}</div>}
                            </div>
                        </div>
                        {!isLast && (
                            <div
                                style={{
                                    flex: 1,
                                    ...(direction === "vertical"
                                        ? {width: 1, minHeight: 24, margin: "4px 0 4px 15px", background: stepStatus === "finish" ? "#1677ff" : "#0000001a"}
                                        : {height: 1, margin: "0 16px", background: stepStatus === "finish" ? "#1677ff" : "#0000001a"}),
                                }}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
});
