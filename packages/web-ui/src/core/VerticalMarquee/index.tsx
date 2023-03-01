import React from "react";
import {classNames} from "../../util/ClassNames";
import "./index.less";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props {
    children: React.ReactNode;
    className?: string;
    styles?: React.CSSProperties;
    speed?: number; // number of pixels scrolled per second
}

export interface State {
    hasShadowChildren: boolean;
    paused: boolean;
}

export const VerticalMarquee = ReactUtil.memo("VerticalMarquee", ({className: extraClassName, speed, styles, children}: Props) => {
    const [contentHeight, setContentHeight] = React.useState(0);
    const animationSpeed = contentHeight / (speed || 30);

    const containerRef = React.useRef<HTMLDivElement>(null);

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

    const pageSize = contentHeight / (containerRef.current?.offsetHeight || 1);

    return (
        <div ref={containerRef} className="g-marquee-container">
            <div className={classNames("g-marquee", extraClassName)} style={{...styles, height: containerRef.current?.offsetHeight}}>
                <div ref={marqueeInnerRef} className="inner" style={pageSize > 1 ? marqueeInnerAnimationStyle : undefined}>
                    {children}
                    {children}
                </div>
            </div>
        </div>
    );
});
