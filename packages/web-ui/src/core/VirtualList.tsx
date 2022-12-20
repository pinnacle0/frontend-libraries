import "../internal/polyfill/ResizeObserver";
import React from "react";
import {useVirtualizer, observeElementOffset as defaultObserveElementOffset, observeElementRect as defaultObserveElementRect} from "@tanstack/react-virtual";
import type {VirtualizerOptions} from "@tanstack/react-virtual";
import type {ComponentType} from "react";
import type {StringKey} from "../internal/type";

const DEFAULT_ITEM_SIZE = 100;

type Direction = "horizontal" | "vertical";

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
    observeElementRect?: VirtualizerOptions<HTMLElement, HTMLElement>["observeElementRect"];
    observeElementOffset?: VirtualizerOptions<HTMLElement, HTMLElement>["observeElementOffset"];
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
    observeElementOffset,
    fixedSize,
    observeElementRect,
}: Props<T>) {
    const Item = renderData;
    const parentRef = React.useRef<HTMLDivElement | null>(null);
    const horizontal = direction === "horizontal";
    const sizeStyle: React.CSSProperties = horizontal ? {height: "100%"} : {width: "100%"};
    const virtualizer = useVirtualizer<HTMLElement, HTMLElement>({
        initialRect,
        horizontal,
        count: data.length,
        getScrollElement: () => parentRef.current,
        estimateSize: fixedSize ?? (() => DEFAULT_ITEM_SIZE),
        observeElementOffset: observeElementOffset ?? defaultObserveElementOffset,
        observeElementRect: observeElementRect ?? defaultObserveElementRect,
        overscan,
    });

    const getItemKey = (index: number) => (rowKey === "index" ? index : data[index][rowKey]);

    return (
        <div className="g-virtual-list" ref={parentRef} style={{flex: 1, width: "100%", height: "100%", overflow: "auto"}}>
            <div
                className="g-virtual-list-inner"
                style={{
                    position: "relative",
                    height: horizontal ? "100%" : virtualizer.getTotalSize(),
                    width: horizontal ? virtualizer.getTotalSize() : "100%",
                }}
            >
                {virtualizer.getVirtualItems().map(virtualRow => (
                    <div
                        className="g-virtual-list-item"
                        key={getItemKey(virtualRow.index) as string | number}
                        ref={virtualizer.measureElement}
                        data-index={virtualRow.index}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            transform: horizontal ? `translateX(${virtualRow.start}px)` : `translateY(${virtualRow.start}px)`,
                            ...sizeStyle,
                        }}
                    >
                        <div className="g-virtual-list-item-wrapper" style={{...sizeStyle}}>
                            <Item data={data[virtualRow.index]} index={virtualRow.index} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
