import type {ForwardedRef} from "react";
import React from "react";
import type {ItemRenderer, RegisterChild} from "./type";

export interface Props<T> {
    data: T;
    index: number;
    style: React.CSSProperties;
    measure: () => void;
    itemRenderer: ItemRenderer<T>;
}

export const RowRenderer = React.forwardRef(function <T>(props: Props<T>, ref: ForwardedRef<HTMLDivElement>) {
    const {style, measure, itemRenderer, data, index} = props;
    const measureRef = React.useRef(measure);
    measureRef.current = measure;

    React.useEffect(() => {
        measureRef.current();
    }, [data]);

    return (
        <div style={style} ref={ref} className="g-flat-list-item-wrapper">
            {React.createElement(itemRenderer, {data, index, measure})}
        </div>
    );
});
