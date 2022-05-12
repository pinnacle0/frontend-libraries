import React from "react";
import classNames from "classnames";
import {Wrapper} from "./shared/Wrapper";
import type {FlatListProps, LoadingType} from "./type";
import {Footer} from "./shared/Footer";

export const FlatList = function <T>(props: FlatListProps<T>) {
    const {
        data,
        renderItem: ItemRenderer,
        // TODO/Alvis add auto load to flat list
        autoLoad,
        loading = false,
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
    } = props;

    const listWrapperRef = React.useRef<HTMLDivElement>(null);
    const [loadingType, setLoadingType] = React.useState<LoadingType>(null);

    return (
        <Wrapper
            listWrapperRef={listWrapperRef}
            bounceEffect={bounceEffect}
            innerStyle={contentStyle}
            className={classNames("g-flat-list", className)}
            style={style}
            onPullDownRefresh={onPullDownRefresh}
            onPullUpLoading={onPullUpLoading}
            loading={loading}
            onLoadingTypeChange={setLoadingType}
            pullDownRefreshMessage={pullDownRefreshMessage}
        >
            {data.length === 0 ? (
                emptyPlaceholder
            ) : (
                <div className="list">
                    {data.map((d, i) => (
                        <div className="g-flat-list-item">
                            <ItemRenderer data={d} index={i} />
                        </div>
                    ))}
                    <Footer loading={loading && loadingType === "loading"} ended={!onPullUpLoading} endMessage={endOfListMessage} loadingMessage={pullUpLoadingMessage} />
                </div>
            )}
        </Wrapper>
    );
};
