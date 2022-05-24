import React from "react";
import type {VirtualItem} from "react-virtual";
import type {ItemRenderer} from "./type";

export interface Gap {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
}

export interface ListItemProps<T> {
    virtualItem: VirtualItem;
    data: T;
    renderItem: ItemRenderer<T>;
    gap?: Gap;
}

export const Item = function <T>(props: ListItemProps<T>) {
    const {data, virtualItem, gap, renderItem: ItemRenderer} = props;

    const padding = React.useMemo((): React.CSSProperties => (gap ? {paddingLeft: gap.left, paddingRight: gap.right, paddingBottom: gap.bottom, paddingTop: gap.top} : {}), [gap]);

    return (
        <div className="g-virtual-flat-list-item-wrapper" style={{transform: `translateY(${virtualItem.start}px)`}} ref={virtualItem.measureRef}>
            <div className="g-virtual-flat-list-item" style={{...padding}}>
                <ItemRenderer data={data} index={virtualItem.index} measure={virtualItem.measureRef} />
            </div>
        </div>
    );
};
