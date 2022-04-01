import React from "react";
import {CellMeasurer} from "./CellMeasurer";
import type {ItemRenderer, ListItemData, Measure} from "./type";
import type {ListChildComponentProps} from "react-window";

interface WrapperProps<T> extends ListChildComponentProps {
    itemRenderer: ItemRenderer<T>;
    measure: Measure;
}

const ItemRendererWrapper = React.forwardRef(function <T>(props: WrapperProps<T>, ref: React.ForwardedRef<HTMLDivElement>) {
    const {style, data, index, measure, itemRenderer: Item} = props;

    const measureRef = React.useRef(measure);
    measureRef.current = measure;

    React.useEffect(() => {
        measureRef.current();
    }, [data]);

    return (
        <div style={style} ref={ref} className="g-flat-list-item-wrapper">
            <Item data={data} index={index} measure={measure} />
        </div>
    );
});

export const ListItem = function <T>(props: ListChildComponentProps<ListItemData<T>>) {
    const {data, index, style} = props;
    const {cache, parent, data: rawData, itemRenderer} = data;

    return (
        <CellMeasurer cache={cache} rowIndex={index} parent={parent}>
            {({registerChild, measure}) => (
                <ItemRendererWrapper ref={registerChild} style={style} data={rawData[index]} index={index} itemRenderer={itemRenderer as ItemRenderer<any>} measure={measure} />
            )}
        </CellMeasurer>
    );
};
