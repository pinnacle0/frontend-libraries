import React from "react";
import {Footer} from "../shared/Footer";
import type {FooterData} from "../type";
import type {ItemRenderer, Measure} from "./type";

export interface Gap {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
}

export interface ListItemProps<T> {
    measure: Measure;
    data: (T | FooterData)[];
    index: number;
    itemRenderer: ItemRenderer<T>;
    gap?: Gap;
}

export const Item = function <T>(props: ListItemProps<T>) {
    const {data, index, itemRenderer: ItemRenderer, gap, measure} = props;

    const padding = React.useMemo((): React.CSSProperties => (gap ? {paddingLeft: gap.left, paddingRight: gap.right, paddingBottom: gap.bottom, paddingTop: gap.top} : {}), [gap]);

    if (index === data.length - 1) {
        const {loading, loadingMessage, endMessage, ended} = data[index] as FooterData;
        return <Footer loading={loading} ended={ended} loadingMessage={loadingMessage} endMessage={endMessage} measure={measure} />;
    } else {
        return (
            <div className="g-virtual-flat-list-item" style={{...padding}}>
                <ItemRenderer data={data[index] as T} index={index} measure={measure} />
            </div>
        );
    }
};
