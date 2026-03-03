import React from "react";
import classNames from "classnames";
import {ReactUtil} from "../../util/ReactUtil";

interface RowProps {
    gutter?: number | [number, number];
    justify?: "start" | "end" | "center" | "space-around" | "space-between" | "space-evenly";
    align?: "top" | "middle" | "bottom" | "stretch";
    wrap?: boolean;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

interface ColProps {
    span?: number;
    offset?: number;
    push?: number;
    pull?: number;
    order?: number;
    flex?: string | number;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

const Row = ({gutter, justify, align, wrap = true, className, style, children}: RowProps) => {
    const [hGutter, vGutter] = Array.isArray(gutter) ? gutter : [gutter || 0, 0];
    const alignMap = {top: "flex-start", middle: "center", bottom: "flex-end", stretch: "stretch"} as const;

    return (
        <div
            className={classNames("g-row", className)}
            style={{
                display: "flex",
                flexWrap: wrap ? "wrap" : "nowrap",
                justifyContent: justify,
                alignItems: align ? alignMap[align] : undefined,
                marginLeft: hGutter ? -hGutter / 2 : undefined,
                marginRight: hGutter ? -hGutter / 2 : undefined,
                rowGap: vGutter || undefined,
                ...style,
            }}
        >
            {React.Children.map(children, child => {
                if (React.isValidElement(child) && hGutter) {
                    return React.cloneElement(child as React.ReactElement<any>, {
                        style: {paddingLeft: hGutter / 2, paddingRight: hGutter / 2, ...(child.props as any).style},
                    });
                }
                return child;
            })}
        </div>
    );
};
Row.displayName = "Grid.Row";

const Column = ({span, offset, push, pull, order, flex, className, style, children}: ColProps) => {
    const width = span !== undefined ? `${(span / 24) * 100}%` : undefined;
    return (
        <div
            className={classNames("g-col", className)}
            style={{
                flex: flex ?? (span !== undefined ? `0 0 ${width}` : undefined),
                maxWidth: width,
                marginLeft: offset ? `${(offset / 24) * 100}%` : undefined,
                left: push ? `${(push / 24) * 100}%` : undefined,
                right: pull ? `${(pull / 24) * 100}%` : undefined,
                order,
                position: push || pull ? "relative" : undefined,
                ...style,
            }}
        >
            {children}
        </div>
    );
};
Column.displayName = "Grid.Column";

export const Grid = ReactUtil.statics("Grid", {
    Row,
    Column,
});
