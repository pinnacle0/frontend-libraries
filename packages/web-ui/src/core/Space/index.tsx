import React from "react";
import classNames from "classnames";
import {ReactUtil} from "../../util/ReactUtil";

type SpaceSize = "small" | "middle" | "large" | number;

interface SpaceProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: SpaceSize | [SpaceSize, SpaceSize];
    direction?: "horizontal" | "vertical";
    align?: "start" | "end" | "center" | "baseline";
    wrap?: boolean;
    split?: React.ReactNode;
}

interface CompactProps extends React.HTMLAttributes<HTMLDivElement> {
    direction?: "horizontal" | "vertical";
    block?: boolean;
}

const sizeMap: Record<string, number> = {small: 8, middle: 16, large: 24};

const getGap = (size: SpaceSize): number => (typeof size === "number" ? size : sizeMap[size] || 8);

const Compact = ({direction = "horizontal", block, className, style, children, ...htmlProps}: CompactProps) => (
    <div
        className={classNames("g-space-compact", className)}
        style={{
            display: block ? "flex" : "inline-flex",
            flexDirection: direction === "vertical" ? "column" : "row",
            ...style,
        }}
        {...htmlProps}
    >
        {children}
    </div>
);
Compact.displayName = "Space.Compact";

export const Space = ReactUtil.compound("Space", {Compact}, (props: SpaceProps) => {
    const {size = "small", direction = "horizontal", align, wrap, split, className, style, children, ...htmlProps} = props;

    const items = React.Children.toArray(children).filter(c => c !== null && c !== undefined);
    const [colGap, rowGap] = Array.isArray(size) ? [getGap(size[0]), getGap(size[1])] : [getGap(size), getGap(size)];

    return (
        <div
            className={classNames("g-space", className)}
            {...htmlProps}
            style={{
                display: "inline-flex",
                flexDirection: direction === "vertical" ? "column" : "row",
                alignItems: align ? (align === "start" ? "flex-start" : align === "end" ? "flex-end" : align) : undefined,
                flexWrap: wrap ? "wrap" : undefined,
                columnGap: colGap,
                rowGap,
                ...style,
            }}
        >
            {items.map((child, i) => (
                <React.Fragment key={i}>
                    {child}
                    {split && i < items.length - 1 ? split : null}
                </React.Fragment>
            ))}
        </div>
    );
});
