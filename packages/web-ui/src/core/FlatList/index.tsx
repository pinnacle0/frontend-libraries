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
    // Automatic load new data when scroll to bottom, a number {X} mean: when to scroll to last {X} items, auto load is going to be triggered
    autoLoad?: boolean | number;
    emptyPlaceholder?: string | React.ReactElement;
    style?: React.CSSProperties;
    contentStyle?: React.CSSProperties;
    gap?: {top?: number; bottom?: number; left?: number; right?: number};
    swipable?: boolean;
}

const LOADING_TRANSITION = 50;

export function FlatList<T>(props: Props<T>) {
    const {data, renderItem, pullDownMessage, loading = false, onPullDownRefresh, onPullUpLoading, emptyPlaceholder, style, contentStyle, gap, swipable = true, autoLoad: autoRefresh = true} = props;

    const [outBound, setOutBound] = React.useState(false);
    const [count, setCount] = React.useState(0);

    const listRef = React.useRef<VariableSizeList>(null);
    const outerRef = React.useRef<HTMLElement>(null);
    const innerContainerRef = React.useRef<HTMLDivElement>(null);

    const startOffsetRef = React.useRef(0);

    const transit = useTransition(innerContainerRef);
    const cache = React.useMemo(() => new CellMeasurerCache({defaultHeight: 0}), []);

    const isScrollTop = () => {
        return outerRef.current?.scrollTop === 0;
    };

    const clearSwipe = React.useCallback(() => {
        startOffsetRef.current = 0;
        setOutBound(false);
    }, []);

    const onSizeReset = React.useCallback((rowIndex: number) => {
        listRef.current?.resetAfterIndex(rowIndex);
    }, []);

    const handlers = useSwipe(
        {
            onStart: () => {
                // startOffsetRef.current = y;
                // setOutBound(true);
                // transit.clear();
            },
            onMove: state => {
                setCount(_ => _ + 1);
                // transit.to({
                //     y: y - startOffsetRef.current,
                //     immediate: true,
                // });
            },
            onEnd: state => {
                // if (state.direction === Direction.DOWN && Math.abs(state.delta[1]) >= PULL_DOWN_THRESHOLD) {
                //     // transit.to({y: LOADING_TRANSITION, immediate: false});
                //     transit.clear();
                //     onPullDownRefresh?.();
                // } else {
                //     transit.clear();
                // }
                // clearSwipe();
            },
            onCancel: () => {
                // clearSwipe();
                // transit.clear();
            },
        },
        {
            threshold: ({direction}) => direction === Direction.DOWN && isScrollTop(),
        }
    );

    return (
        <div className="g-flat-list-wrapper">
            <div className="inner-container" ref={innerContainerRef} {...handlers}>
                <Loading loading={loading} message={pullDownMessage} />
                <AutoSizer>
                    {size => (
                        <VariableSizeList height={size.height} width={size.width} itemCount={data.length} itemSize={cache.itemSize.bind(cache)} outerRef={outerRef} ref={listRef}>
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
