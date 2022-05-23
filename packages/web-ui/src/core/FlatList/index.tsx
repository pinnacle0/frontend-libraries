import React from "react";
import {Wrapper} from "./shared/Wrapper";
import type {FlatListProps, LoadingType} from "./type";
import {Footer} from "./shared/Footer";
import {useLoadingWithDelay} from "./shared/hooks/useLoadingWithDelay";
import {classNames} from "../../util/ClassNames";
import {GetRowKey} from "./shared/GetRowKey";

export const FlatList = function <T>(props: FlatListProps<T>) {
    const {
        data,
        renderItem: ItemRenderer,
        rowKey,
        loading,
        bounceEffect = true,
        className,
        style,
        onPullDownRefresh,
        onPullUpLoading,
        pullDownRefreshMessage,
        pullUpLoadingMessage,
        contentStyle,
        emptyPlaceholder,
        endOfListMessage,
        hideFooter,
    } = props;

    const listWrapperRef = React.useRef<HTMLDivElement>(null);
    const [loadingType, setLoadingType] = React.useState<LoadingType>(null);
    const loadingWithDelay = useLoadingWithDelay(loading ?? false, 250);

    React.useEffect(() => {
        if ((loading === undefined || loading === null) && (onPullDownRefresh || onPullUpLoading)) {
            throw new Error("Loading must be specify when given either onPullDownRefresh or onPullUpLoading");
        }
    }, [onPullDownRefresh, onPullUpLoading, loading]);

    // Automatically loading new data when scroll near the bottom
    const onScroll = (e: React.UIEvent) => {
        if (!loadingWithDelay && onPullUpLoading) {
            const {scrollHeight, scrollTop, clientHeight} = e.currentTarget;
            if (scrollHeight * 0.8 < clientHeight + scrollTop) {
                setLoadingType("loading");
                onPullUpLoading?.();
            }
        }
    };

    return (
        <Wrapper
            className={classNames("g-flat-list", className)}
            listWrapperRef={listWrapperRef}
            bounceEffect={bounceEffect}
            innerStyle={contentStyle}
            loadingType={loadingType}
            onLoadingTypeChange={setLoadingType}
            loading={loadingWithDelay}
            style={style}
            onPullDownRefresh={onPullDownRefresh}
            onPullUpLoading={onPullUpLoading}
            pullDownRefreshMessage={pullDownRefreshMessage}
            onScroll={onScroll}
        >
            {data.length === 0 ? (
                emptyPlaceholder
            ) : (
                <div className="list">
                    {data.map((d, i) => (
                        <div className="g-flat-list-item" key={GetRowKey(rowKey, d, i)}>
                            <ItemRenderer data={d} index={i} />
                        </div>
                    ))}
                    {!hideFooter && <Footer loading={loadingWithDelay && loadingType === "loading"} ended={!onPullUpLoading} endMessage={endOfListMessage} loadingMessage={pullUpLoadingMessage} />}
                </div>
            )}
        </Wrapper>
    );
};
