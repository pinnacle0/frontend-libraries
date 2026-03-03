import React from "react";
import {classNames} from "../../util/ClassNames";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props {
    active?: boolean;
    loading?: boolean;
    avatar?: boolean | {shape?: "circle" | "square"; size?: number | "small" | "default" | "large"};
    paragraph?: boolean | {rows?: number; width?: number | string | Array<number | string>};
    title?: boolean | {width?: number | string};
    round?: boolean;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

const shimmerKeyframes = `
@keyframes g-skeleton-shimmer {
    0% { background-position: -400px 0; }
    100% { background-position: 400px 0; }
}
`;

let styleInjected = false;
const injectStyle = () => {
    if (styleInjected) return;
    const el = document.createElement("style");
    el.textContent = shimmerKeyframes;
    document.head.appendChild(el);
    styleInjected = true;
};

const blockStyle = (active?: boolean, round?: boolean): React.CSSProperties => ({
    background: active ? "linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%)" : "#f2f2f2",
    backgroundSize: active ? "400% 100%" : undefined,
    animation: active ? "g-skeleton-shimmer 1.4s ease infinite" : undefined,
    borderRadius: round ? 100 : 4,
});

export const Skeleton = ReactUtil.memo("Skeleton", ({active = true, loading = true, avatar, paragraph = true, title = true, round, className, style, children}: Props) => {
    React.useEffect(() => {
        if (active) injectStyle();
    }, [active]);

    if (!loading) return <React.Fragment>{children}</React.Fragment>;

    const titleWidth = typeof title === "object" ? title.width || "38%" : "38%";
    const rows = typeof paragraph === "object" ? (paragraph.rows ?? 3) : paragraph ? 3 : 0;
    const avatarSize = typeof avatar === "object" ? (typeof avatar.size === "number" ? avatar.size : avatar.size === "large" ? 40 : avatar.size === "small" ? 24 : 32) : 32;
    const avatarShape = typeof avatar === "object" ? avatar.shape || "circle" : "circle";

    return (
        <div className={classNames("g-skeleton", className)} style={{display: "flex", gap: 16, ...style}}>
            {avatar && <div style={{width: avatarSize, height: avatarSize, flexShrink: 0, borderRadius: avatarShape === "circle" ? "50%" : 4, ...blockStyle(active)}} />}
            <div style={{flex: 1}}>
                {title && <div style={{height: 16, marginBottom: 16, width: titleWidth, ...blockStyle(active, round)}} />}
                {Array.from({length: rows}).map((_, i) => (
                    <div
                        key={i}
                        style={{
                            height: 16,
                            marginBottom: i < rows - 1 ? 12 : 0,
                            width: i === rows - 1 ? "61%" : "100%",
                            ...blockStyle(active, round),
                        }}
                    />
                ))}
            </div>
        </div>
    );
});
