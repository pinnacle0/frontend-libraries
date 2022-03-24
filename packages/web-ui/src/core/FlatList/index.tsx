import React from "react";
import {VariableSizeList} from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import {CellMeasurer} from "./CellMeasurer";
import {CellMeasurerCache} from "./CellMeasurerCache";
import {Row} from "./Row";
import type {ItemRenderer} from "./type";
import "./index.less";

export interface Props<T> {
    data: T[];
    renderItem: ItemRenderer<T>;
    emptyPlaceholder?: string | React.ReactElement;
    style?: React.CSSProperties;
    contentStyle?: React.CSSProperties;
}

export function FlatList<T>(props: Props<T>) {
    const {data, renderItem} = props;
    const listRef = React.useRef<VariableSizeList | null>(null);
    const cache = React.useMemo(() => new CellMeasurerCache({defaultHeight: 0}), []);

    const onSizeReset = React.useCallback((rowIndex: number) => {
        listRef.current?.resetAfterIndex(rowIndex);
    }, []);

    return (
        <div className="g-flat-list-wrapper">
            <AutoSizer>
                {size => (
                    <VariableSizeList height={size.height} width={size.width} itemCount={data.length} itemSize={cache.itemSize.bind(cache)} ref={listRef}>
                        {({index, style}) => (
                            <CellMeasurer rowIndex={index} cache={cache} onSizeReset={onSizeReset}>
                                {({registerChild, measure}) => (
                                    <Row style={style} ref={registerChild} data={data[index]} index={index} itemRenderer={renderItem as ItemRenderer<unknown>} measure={measure} />
                                )}
                            </CellMeasurer>
                        )}
                    </VariableSizeList>
                )}
            </AutoSizer>
        </div>
    );
}
