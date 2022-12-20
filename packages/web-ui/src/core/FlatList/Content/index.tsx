import React from "react";
import {useGap} from "../useGap";
import {Footer as DefaultFooter} from "./Footer";
import type {FlatListProps} from "../type";
import "../../../internal/polyfill/IntersectionObserver";

interface DataWithIndex<T> {
    d: T;
    i: number;
}

interface Props<T> extends Pick<FlatListProps<T>, "data" | "renderItem" | "gap" | "emptyPlaceholder" | "rowKey" | "Footer" | "endOfListMessage" | "onPullUpLoading" | "loadingThreshold"> {
    loading: boolean;
    hasNextPageMessage?: string;
}

export function Content<T>({data, emptyPlaceholder, renderItem, gap, rowKey, loading, Footer, endOfListMessage, onPullUpLoading, hasNextPageMessage, loadingThreshold = 4}: Props<T>) {
    const Item = renderItem;
    const itemStyle = useGap(gap);
    const markerId = React.useRef(createKey());
    const loadedDataKey = React.useRef<string | null>(null);
    const {first, second} = React.useMemo(() => splitByLast(data, loadingThreshold), [data, loadingThreshold]);
    const [dataKey, setDataKey] = React.useState(createKey());

    const previousMarker = React.useRef<HTMLDivElement | null>(null);
    const onPullUpLoadingRef = React.useRef(onPullUpLoading);
    onPullUpLoadingRef.current = onPullUpLoading;

    const observer = React.useMemo(
        () =>
            new IntersectionObserver(mutations => {
                const mutation = mutations[0];
                if (!mutation.isIntersecting) return;

                const currentDataKey = mutation.target.getAttribute("data-key");

                if (loadedDataKey.current === currentDataKey) return;
                loadedDataKey.current = currentDataKey;
                onPullUpLoadingRef.current?.();
            }),
        []
    );

    const markerRef = (node: HTMLDivElement | null) => {
        previousMarker.current && observer.unobserve(previousMarker.current);
        if (node) {
            observer.observe(node);
            previousMarker.current = node;
        }
    };

    React.useEffect(() => setDataKey(createKey()), [data]);

    const createItem = (source: DataWithIndex<T>[]) => {
        return source.map(({d, i}) => (
            <div className="g-flat-list-item" key={rowKey === "index" ? i : String(d[rowKey])} style={itemStyle}>
                <Item data={d} index={i} />
            </div>
        ));
    };

    return (
        <div className="g-flat-list-content">
            {data.length === 0 && emptyPlaceholder ? (
                emptyPlaceholder
            ) : (
                <React.Fragment>
                    {createItem(first)}
                    <div ref={markerRef} id={markerId.current} data-key={dataKey} />
                    {createItem(second)}
                    {Footer && data.length > 0 ? (
                        <Footer loading={loading} />
                    ) : (
                        <DefaultFooter loading={loading} hasNextPage={onPullUpLoading !== undefined} endOfListMessage={endOfListMessage} hasNextPageMessage={hasNextPageMessage} />
                    )}
                </React.Fragment>
            )}
        </div>
    );
}

function splitByLast<T>(data: T[], last: number): {first: DataWithIndex<T>[]; second: DataWithIndex<T>[]} {
    const pair = data.map((d, i) => ({d, i}));
    const from = Math.max(0, data.length - last);
    return {first: pair.slice(0, from), second: pair.slice(from)};
}

function createKey() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
