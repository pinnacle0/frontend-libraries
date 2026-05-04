import React from "react";
import {classNames} from "../../util/ClassNames";
import {useVirtualizer} from "@tanstack/react-virtual";
import type {ComponentType} from "react";
import type {VirtualItem, Virtualizer} from "@tanstack/react-virtual";
import "./index.less";
import {ReactUtil} from "../../util/ReactUtil";

const DEFAULT_ITEM_SIZE = 100;

export type Direction = "horizontal" | "vertical";

export type VirtualListHandler = Virtualizer<HTMLElement, HTMLElement>;

export interface ItemProps<T extends object> {
    index: number;
    data: T;
}

export interface Props<T extends object> {
    initialRect?: {width: number; height: number};
    data: T[];
    renderItem: ComponentType<ItemProps<T>>;
    rowKey?: keyof T | "index";
    direction?: Direction;
    fixedSize?: (index: number) => number;
    overscan?: number;
    id?: string;
    className?: string;
    style?: React.CSSProperties;
    innerClassName?: string;
    itemClassName?: string;
    itemStyle?: React.CSSProperties;
    itemWrapperClassName?: string;
    itemWrapperStyle?: React.CSSProperties;
    footer?: React.ReactNode;
    footerSize?: number;
    onScroll?: React.UIEventHandler<HTMLDivElement>;
    onVirtualItemsChange?: (items: VirtualItem[]) => void;
    scrollRef?: React.Ref<HTMLDivElement>;
    listRef?: React.Ref<VirtualListHandler>;
}

/**
 * Efficiently rendering large lists and tabular data
 */
export const VirtualList = ReactUtil.memo(
    "VirtualList",
    <T extends object>({
        data,
        rowKey = "index",
        direction = "vertical",
        renderItem: renderData,
        overscan = 5,
        initialRect = {width: 0, height: 0},
        fixedSize,
        id,
        className,
        style,
        innerClassName,
        itemClassName,
        itemStyle,
        itemWrapperClassName,
        itemWrapperStyle,
        footer,
        footerSize = 0,
        onScroll,
        onVirtualItemsChange,
        scrollRef,
        listRef,
    }: Props<T>) => {
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

        React.useImperativeHandle(listRef, () => virtualizer);
        React.useImperativeHandle(scrollRef, () => parentRef.current!);

        const getItemKey = (index: number) => (rowKey === "index" ? index : data[index][rowKey]);
        const virtualItems = virtualizer.getVirtualItems();
        const totalSize = virtualizer.getTotalSize() + footerSize;
        const innerSizeStyle = horizontal ? {width: totalSize} : {height: totalSize};
        const footerStyle: React.CSSProperties = horizontal ? {transform: `translateX(${virtualizer.getTotalSize()}px)`} : {transform: `translateY(${virtualizer.getTotalSize()}px)`};

        React.useEffect(() => {
            onVirtualItemsChange?.(virtualItems);
        }, [onVirtualItemsChange, virtualItems]);

        return (
            <div id={id} className={classNames("g-virtual-list", className, {horizontal})} ref={parentRef} style={style} onScroll={onScroll}>
                <div className={classNames("g-virtual-list-inner", innerClassName)} style={innerSizeStyle}>
                    {virtualItems.map(virtualRow => (
                        <div
                            className={classNames("g-virtual-list-item", itemClassName)}
                            key={getItemKey(virtualRow.index) as string | number}
                            ref={virtualizer.measureElement}
                            data-index={virtualRow.index}
                            style={{
                                ...itemStyle,
                                transform: horizontal ? `translateX(${virtualRow.start}px)` : `translateY(${virtualRow.start}px)`,
                            }}
                        >
                            <div className={classNames("g-virtual-list-item-wrapper", itemWrapperClassName)} style={itemWrapperStyle}>
                                <Item data={data[virtualRow.index]} index={virtualRow.index} />
                            </div>
                        </div>
                    ))}
                    {footer && (
                        <div className="g-virtual-list-item" style={footerStyle}>
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        );
    }
);
