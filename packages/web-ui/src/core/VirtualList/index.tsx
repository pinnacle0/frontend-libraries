import "../../internal/polyfill/ResizeObserver";
import React from "react";
import {classNames} from "../../util/ClassNames";
import {useVirtualizer} from "@tanstack/react-virtual";
import type {Virtualizer} from "@tanstack/react-virtual";
import type {ComponentType} from "react";
import type {StringKey} from "../../internal/type";
import "./index.less";

const DEFAULT_ITEM_SIZE = 100;

export type Direction = "horizontal" | "vertical";

export interface VirtualListHandler
    extends Pick<
        Virtualizer<HTMLElement, HTMLElement>,
        "scrollElement" | "scrollToIndex" | "scrollToOffset" | "measure" | "getVirtualItems" | "range" | "indexFromElement" | "getTotalSize" | "scrollElement"
    > {}

export interface ItemProps<T extends object> {
    index: number;
    data: T;
}

export interface Props<T extends object> {
    initialRect?: {width: number; height: number};
    data: T[];
    renderItem: ComponentType<ItemProps<T>>;
    rowKey?: StringKey<T> | "index";
    direction?: Direction;
    fixedSize?: (index: number) => number;
    overscan?: number;
    id?: string;
    className?: string;
    listRef?: React.Ref<Virtualizer<HTMLElement, HTMLElement>>;
}

/**
 * Efficiently rendering large lists and tabular data
 */
export function VirtualList<T extends object>({
    data,
    rowKey = "index",
    direction = "vertical",
    renderItem: renderData,
    overscan = 5,
    initialRect = {width: 0, height: 0},
    fixedSize,
    id,
    className,
}: Props<T>) {
    const Item = renderData;
    const parentRef = React.useRef<HTMLDivElement | null>(null);
    const horizontal = direction === "horizontal";
    const virtualizer = useVirtualizer<HTMLElement, HTMLElement>({
        initialRect,
        horizontal,
        count: data.length,
        getScrollElement: () => parentRef.current,
        estimateSize: fixedSize ?? (() => DEFAULT_ITEM_SIZE),
        overscan,
    });

    const getItemKey = (index: number) => (rowKey === "index" ? index : data[index][rowKey]);

    return (
        <div id={id} className={classNames("g-virtual-list", className, {horizontal})} ref={parentRef}>
            <div className="g-virtual-list-inner" style={horizontal ? {width: virtualizer.getTotalSize()} : {height: virtualizer.getTotalSize()}}>
                {virtualizer.getVirtualItems().map(virtualRow => (
                    <div
                        className="g-virtual-list-item"
                        key={getItemKey(virtualRow.index) as string | number}
                        ref={virtualizer.measureElement}
                        data-index={virtualRow.index}
                        style={{transform: horizontal ? `translateX(${virtualRow.start}px)` : `translateY(${virtualRow.start}px)`}}
                    >
                        <div className="g-virtual-list-item-wrapper">
                            <Item data={data[virtualRow.index]} index={virtualRow.index} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
