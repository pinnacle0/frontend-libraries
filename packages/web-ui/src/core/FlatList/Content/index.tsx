import React from "react";
import {Footer} from "./Footer";
import type {FlatListProps, FlatListItemProps, Gap} from "../type";
import "../../../internal/polyfill/IntersectionObserver";

interface Props<T> extends Pick<FlatListProps<T>, "data" | "renderItem" | "gap" | "emptyPlaceholder" | "rowKey" | "endOfListMessage" | "onPullUpLoading" | "endReachThreshold" | "loading"> {
    hasNextPageMessage?: string;
}

export function Content<T>({data, emptyPlaceholder, renderItem, gap, rowKey, loading = false, endOfListMessage, onPullUpLoading, hasNextPageMessage, endReachThreshold = 4}: Props<T>) {
    const Item = renderItem;
    const itemStyle = useGap(gap);
    const markerId = React.useRef(createKey());
    const {first, second} = React.useMemo(() => splitByLast(data, endReachThreshold), [data, endReachThreshold]);
    const [dataKey, setDataKey] = React.useState(createKey());
    const loadedDataKey = React.useRef<string>(createKey());

    const previousMarker = React.useRef<HTMLDivElement | null>(null);
    const onPullUpLoadingRef = React.useRef(onPullUpLoading);
    onPullUpLoadingRef.current = onPullUpLoading;

    const observer = React.useMemo(
        () =>
            new IntersectionObserver(mutations => {
                const mutation = mutations[0];
                if (!mutation.isIntersecting) return;

                const currentDataKey = mutation.target.getAttribute("data-key")!;

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

    const createItem = (source: FlatListItemProps<T>[]) => {
        return source.map(({data, index}) => (
            <div className="g-flat-list-item" key={rowKey === "index" ? index : String(data[rowKey])} style={itemStyle}>
                <Item data={data} index={index} />
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
                    <div key={markerId.current} ref={markerRef} id={markerId.current} data-key={dataKey} />
                    {createItem(second)}
                    {data.length > 0 && <Footer loading={loading} hasNextPage={onPullUpLoading !== undefined} endOfListMessage={endOfListMessage} hasNextPageMessage={hasNextPageMessage} />}
                </React.Fragment>
            )}
        </div>
    );
}

function useGap(gap?: Gap): React.CSSProperties {
    if (!gap) return {};
    if (Array.isArray(gap)) {
        return {marginTop: gap[0], marginBottom: gap[0], marginLeft: gap[1], marginRight: gap[1]};
    } else if (typeof gap === "number") {
        return {marginTop: gap, marginBottom: gap, marginLeft: gap, marginRight: gap};
    } else {
        const {top, bottom, left, right} = gap;
        return {marginTop: top, marginBottom: bottom, marginLeft: left, marginRight: right};
    }
}

function splitByLast<T>(data: T[], last: number): {first: FlatListItemProps<T>[]; second: FlatListItemProps<T>[]} {
    const pair = data.map((data, index) => ({data, index}));
    const from = Math.max(0, data.length - last);
    return {first: pair.slice(0, from), second: pair.slice(from)};
}

function createKey() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
