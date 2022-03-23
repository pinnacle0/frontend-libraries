import React from "react";
import {VariableSizeList} from "react-window";
import {CellMeasurer} from "./CellMeasurer";
import {CellMeasurerCache} from "./CellMeasurerCache";
import type {ItemRenderer} from "./type";
import "./index.less";
import {RowRenderer} from "./RowRenderer";

export interface Props<T> {
    data: T[];
    itemRenderer: ItemRenderer<T>;
}

export function FlatList<T>(props: Props<T>) {
    const {data, itemRenderer} = props;
    const listRef = React.useRef<VariableSizeList | null>(null);
    const cache = React.useMemo(() => new CellMeasurerCache({defaultHeight: 0}), []);

    React.useEffect(() => {
        // update height when all item is ready
        listRef.current?.resetAfterIndex(0);
    }, [data]);

    const onSizeReset = React.useCallback((rowIndex: number) => {
        listRef.current?.resetAfterIndex(rowIndex);
    }, []);

    return (
        <VariableSizeList height={500} itemCount={data.length} itemSize={cache.itemSize.bind(cache)} width={300} ref={listRef}>
            {({index, style}) => (
                <CellMeasurer data={data[index]} rowIndex={index} cache={cache} onSizeReset={onSizeReset}>
                    {({registerChild, measure}) => <RowRenderer style={style} ref={registerChild} data={data} index={index} itemRenderer={itemRenderer as ItemRenderer<unknown>} measure={measure} />}
                </CellMeasurer>
            )}
        </VariableSizeList>
    );
}
