import React from "react";
import {classNames} from "../../util/ClassNames";
import {ReactUtil} from "../../util/ReactUtil";
import "./index.less";

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
    const [containerHeight, setContainerHeight] = React.useState(0);
    const [contentHeight, setContentHeight] = React.useState(0);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const animationSpeed = contentHeight / (speed || 30);

    const getContainerHeight = React.useCallback(() => {
        if (!containerRef.current) return;
        setContainerHeight(containerRef.current.clientHeight);
    }, []);

    const marqueeInnerRef = (node: HTMLDivElement | null) => {
        if (!node) return;
        setContentHeight(node?.clientHeight);
    };

    const marqueeInnerAnimationStyle: React.CSSProperties = React.useMemo(
        () => ({
            animation: `marquee ${animationSpeed}s linear infinite`,
            transform: `translate(0, calc(-100% + ${contentHeight / 2}px))`,
        }),
        [animationSpeed, contentHeight]
    );

    const pageSize = contentHeight / containerHeight;

    React.useEffect(() => {
        if (containerRef.current) {
            getContainerHeight();

            const observer = new ResizeObserver(entries => {
                const target = entries.find(entry => entry.target === containerRef.current);
                target && getContainerHeight();
            });
            observer.observe(containerRef.current);
            return () => observer.disconnect();
        }
    }, [getContainerHeight]);

    return (
        <div className={classNames("g-marquee", extraClassName)} ref={containerRef} style={styles}>
            <div ref={marqueeInnerRef} className="inner" style={pageSize > 1 ? marqueeInnerAnimationStyle : undefined}>
                {children}
                {children}
            </div>
        </div>
    );
});
