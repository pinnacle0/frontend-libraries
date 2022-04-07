import React from "react";
import {CellMeasurer} from "./CellMeasurer";
import type {FooterData, ItemRenderer, ListItemData, Measure} from "./type";
import type {ListChildComponentProps} from "react-window";
import {Footer} from "./Footer";

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
    const {cache, parent, data: rawData, itemRenderer, gap} = data;

    const padding = React.useMemo((): React.CSSProperties => {
        return gap ? {paddingLeft: gap.left, paddingRight: gap.right, paddingBottom: gap.bottom, paddingTop: gap.top} : {};
    }, [gap]);

    return (
        <CellMeasurer cache={cache} rowIndex={index} parent={parent}>
            {({registerChild, measure}) => {
                const data = rawData[index];
                if (index === rawData.length - 1) {
                    const {loading, loadingMessage, endMessage, ended} = data as FooterData;
                    return <Footer ref={registerChild} loading={loading} ended={ended} loadingMessage={loadingMessage} endMessage={endMessage} style={style} measure={measure} />;
                } else {
                    return (
                        <ItemRendererWrapper
                            ref={registerChild}
                            style={{...style, ...padding}}
                            data={rawData[index]}
                            index={index}
                            itemRenderer={itemRenderer as ItemRenderer<any>}
                            measure={measure}
                        />
                    );
                }
            }}
        </CellMeasurer>
    );
};
