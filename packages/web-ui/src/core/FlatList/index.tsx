import React from "react";
import {VariableSizeList} from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import {CellMeasurer} from "./CellMeasurer";
import {CellMeasurerCache} from "./CellMeasurerCache";
import {Row} from "./Row";
import type {ItemRenderer} from "./type";
import "./index.less";
import {Loading} from "./Loading";
import {Direction, useSwipe} from "../../hooks/useSwipe";
import {useTransition} from "../../hooks/useTransition";

const PULL_DOWN_THRESHOLD = 60;

export interface Props<T> {
    data: T[];
    renderItem: ItemRenderer<T>;
    pullDownMessage?: string;
    loading?: boolean;
    onPullUpLoading?: () => void;
    onPullDownRefresh?: () => void;
    emptyPlaceholder?: string | React.ReactElement;
    style?: React.CSSProperties;
    contentStyle?: React.CSSProperties;
    gap?: {top?: number; bottom?: number; left?: number; right?: number};
    swipable?: boolean;
}

export function FlatList<T>(props: Props<T>) {
    const {data, renderItem, pullDownMessage, loading = false, onPullDownRefresh, onPullUpLoading, emptyPlaceholder, style, contentStyle, gap, swipable = true} = props;
    const listRef = React.useRef<VariableSizeList | null>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const cache = React.useMemo(() => new CellMeasurerCache({defaultHeight: 0}), []);

    const {transit, clear} = useTransition(containerRef);

    const handlers = useSwipe(
        {
            onStart: state => {
                clear();
            },
            onMove: state => {
                transit({
                    y: state.delta[1],
                    immediate: true,
                });
            },
            onEnd: state => {
                // pull down
                if (state.direction === Direction.DOWN && Math.abs(state.delta[1]) >= PULL_DOWN_THRESHOLD) {
                    transit({
                        y: 80,
                        immediate: false,
                    });
                    onPullDownRefresh?.();
                } else {
                    clear();
                }
            },
            onCancel: state => {
                clear();
            },
        },
        {
            threshold: ({direction}) => direction === Direction.DOWN || direction === Direction.UP,
        }
    );

    const onSizeReset = React.useCallback((rowIndex: number) => {
        listRef.current?.resetAfterIndex(rowIndex);
    }, []);

    return (
        <div className="g-flat-list-wrapper">
            <div className="inner-container" {...handlers} ref={containerRef}>
                <Loading loading={loading} message={pullDownMessage} />
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
        </div>
    );
}
