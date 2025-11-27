import React from "react";
import type {StringKey} from "../../internal/type";
import "./index.less";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props<T extends object> {
    data: T[];
    onClick: (item: T, index: number) => void;
    renderItem: (item: T, index: number) => React.ReactElement | string | number;
    itemKey: StringKey<T> | ((item: T, index?: number) => string) | "index";
    lastClickable?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

export const Breadcrumb = ReactUtil.memo("Breadcrumb", <T extends object>({data, onClick, renderItem, lastClickable, className, style, itemKey}: Props<T>) => {
    const getItemKey = (item: T, index: number): string | number => {
        if (itemKey === "index") return index;
        if (typeof itemKey === "function") return itemKey(item, index);
        return item[itemKey] as any;
    };

    return (
        <div className={`g-breadcrumb ${className || ""}`} style={style}>
            {data.map((_, index) => (
                <div
                    onClick={lastClickable || index !== data.length - 1 ? () => onClick(_, index) : undefined}
                    key={getItemKey(_, index)}
                    className={lastClickable || index !== data.length - 1 ? "clickable" : ""}
                >
                    {renderItem(_, index)}
                </div>
            ))}
        </div>
    );
});
