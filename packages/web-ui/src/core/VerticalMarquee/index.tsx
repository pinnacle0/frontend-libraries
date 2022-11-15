import React from "react";
import "./index.less";

export interface Props {
    height: number;
    children: React.ReactNode;
    className?: string;
    styles?: React.CSSProperties;
    speed?: number; // number of pixels scrolled per second
}

export interface State {
    hasShadowChildren: boolean;
    paused: boolean;
}

export const VerticalMarquee = Object.assign(
    React.memo(({className: extraClassName, speed, height, styles, children}: Props) => {
        const className = ["g-marquee", extraClassName].filter(Boolean).join(" ");
        const [contentHeight, setContentHeight] = React.useState(0);
        const animationSpeed = contentHeight / (speed || 30);

        const marqueeInnerRef = React.useCallback((node: HTMLDivElement | null) => {
            if (!node) {
                return;
            }
            setContentHeight(node?.clientHeight);
        }, []);

        const marqueeInnerAnimationStyle: React.CSSProperties = React.useMemo(
            () => ({
                animation: `marquee ${animationSpeed}s linear infinite`,
                transform: `translate(0, calc(-100% + ${contentHeight / 2}px))`,
            }),
            [animationSpeed, contentHeight]
        );

        const pageSize = contentHeight / height;

        return (
            <div className={className} style={{...styles, height}}>
                <div ref={marqueeInnerRef} className="inner" style={pageSize > 1 ? marqueeInnerAnimationStyle : undefined}>
                    {children}
                    {children}
                </div>
            </div>
        );
    }),
    {displayName: "VerticalMarquee"}
);
