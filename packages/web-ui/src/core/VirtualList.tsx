import React from "react";
import {useVirtualizer, observeElementOffset as defaultObserveElementOffset, observeElementRect as defaultObserveElementRect} from "@tanstack/react-virtual";
import type {VirtualizerOptions} from "@tanstack/react-virtual";
import type {ComponentType} from "react";
import type {StringKey} from "../internal/type";
import {PolyfillUtil} from "../util/PolyfillUtil";

// polyfill of window.ResizeObserver
PolyfillUtil.ResizeObserver();

const DEFAULT_ITEM_SIZE = 100;

type Direction = "horizontal" | "vertical";

export interface ItemProps<T extends object> {
    index: number;
    data: T;
    measure: (element: HTMLElement | null) => void;
}

export interface Props<T extends object> {
    initialRect?: {width: number; height: number};
    data: T[];
    renderData: ComponentType<ItemProps<T>>;
    rowKey?: StringKey<T> | "index";
    direction?: Direction;
    fixedSize?: (index: number) => number;
    overscan?: number;
    observeElementRect?: VirtualizerOptions<HTMLElement | null, HTMLElement>["observeElementRect"];
    observeElementOffset?: VirtualizerOptions<HTMLElement | null, HTMLElement>["observeElementOffset"];
}

export function VirtualList<T extends object>({
    data,
    rowKey = "index",
    direction = "vertical",
    renderData,
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
    const virtualizer = useVirtualizer<HTMLElement | null, HTMLElement>({
        initialRect,
        horizontal,
        count: data.length,
        getScrollElement: () => parentRef.current,
        estimateSize: fixedSize ?? (() => DEFAULT_ITEM_SIZE),
        observeElementOffset: observeElementOffset ?? defaultObserveElementOffset,
        observeElementRect: observeElementRect ?? defaultObserveElementRect,
        overscan,
    });

    const virtualizerRef = React.useRef(virtualizer);
    virtualizerRef.current = virtualizer;

    // TODO/Alvis: This is temporary fix of issue: https://github.com/TanStack/virtual/issues/363, please remove the code after update
    React.useLayoutEffect(() => {
        const v = virtualizerRef.current;
        v._didMount()();
        v._willUpdate();
    }, [data.length]);

    const getItemKey = (index: number) => (rowKey === "index" ? index : data[index][rowKey]);

    return (
        <div className="g-virtual-list" ref={parentRef} style={{width: "100%", height: "100%", overflow: "auto"}}>
            <div
                className="g-virtual-list-inner"
                style={{
                    height: horizontal ? "100%" : virtualizer.getTotalSize(),
                    width: horizontal ? virtualizer.getTotalSize() : "100%",
                    position: "relative",
                }}
            >
                {virtualizer.getVirtualItems().map(virtualRow => (
                    <div
                        className="g-virtual-list-item"
                        key={getItemKey(virtualRow.index) as string | number}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            transform: horizontal ? `translateX(${virtualRow.start}px)` : `translateY(${virtualRow.start}px)`,
                            ...sizeStyle,
                        }}
                    >
                        <div className="g-virtual-list-item-wrapper" ref={virtualRow.measureElement} style={{...sizeStyle}}>
                            <Item data={data[virtualRow.index]} index={virtualRow.index} measure={virtualRow.measureElement} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
