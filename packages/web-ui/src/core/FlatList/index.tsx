import React from "react";
import classNames from "classnames";
import {Wrapper} from "./shared/Wrapper";
import type {FlatListProps, LoadingType} from "./type";
import {Footer} from "./shared/Footer";

export const FlatList = function <T>(props: FlatListProps<T>) {
    const {
        data,
        renderItem,
        autoLoad,
        loading = false,
        bounceEffect,
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
    const contentRef = React.useRef<HTMLDivElement>(null);
    const [loadingType, setLoadingType] = React.useState<LoadingType>(null);

    return (
        <Wrapper
            contentRef={contentRef}
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
            <div className="list" ref={contentRef}>
                {data.map((d, i) => {
                    return <div>hi</div>;
                })}
                <Footer loading={loading && loadingType === "loading"} ended={!onPullUpLoading} endMessage={endOfListMessage} />
            </div>
        </Wrapper>
    );
};
