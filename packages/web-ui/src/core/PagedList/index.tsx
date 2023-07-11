import React from "react";
import {ReactUtil} from "../../util/ReactUtil";
import {classNames} from "../../util/ClassNames";
import {i18n} from "../../internal/i18n/core";
import type {StringKey} from "../../internal/type";
import "./index.less";

export interface Props<T extends object> {
    dataSource: T[];
    rowKey: StringKey<T> | ((record: T, index: number) => string) | "index";
    renderItem: React.ComponentType<{item: T; index: number}>;
    itemWidth: number;
    pageSize: number;
    onPageChange?: (pageIndex: number) => void;
}

export const PagedList = ReactUtil.memo("PagedList", <T extends object>({dataSource, rowKey, renderItem, itemWidth, pageSize, onPageChange}: Props<T>) => {
    const [currentItemIndex, setCurrentItemIndex] = React.useState(0);
    const t = i18n();
    const Component = renderItem;
    const isNextDisabled = currentItemIndex === 0;
    const upperLimit = dataSource.length - pageSize;
    const isPreviousDisabled = currentItemIndex >= upperLimit;
    const currentPageIndex = React.useMemo(() => Math.floor(currentItemIndex / pageSize), [currentItemIndex, pageSize]);

    const goPreviousPage = () => {
        setCurrentItemIndex(Math.max(0, Math.min(currentItemIndex + pageSize, upperLimit)));
    };

    const goNextPage = () => {
        setCurrentItemIndex(Math.max(0, currentItemIndex - pageSize));
    };

    const goCurrentPage = () => setCurrentItemIndex(0);

    const getRowKey = (record: T, index: number): string | number => {
        if (rowKey === "index") {
            return index;
        } else if (typeof rowKey === "function") {
            return rowKey(record, index);
        } else {
            return record[rowKey] as any;
        }
    };

    React.useEffect(() => {
        onPageChange?.(currentPageIndex);
    }, [currentPageIndex, onPageChange]);

    return (
        <div className="g-paged-list">
            <div className="list-wrap" style={{width: itemWidth * pageSize}}>
                <div className="list" style={{transform: `translateX(${currentItemIndex * itemWidth}px)`}}>
                    {dataSource.map((_, index) => (
                        <div style={{flex: `0 0 ${itemWidth}px`}} key={getRowKey(_, index)}>
                            <Component index={index} item={_} />
                        </div>
                    ))}
                </div>
                {dataSource.length === 0 && <div className="no-data">{t.noData}</div>}
            </div>
            <div className="navigation">
                <div onClick={isNextDisabled ? undefined : goNextPage} className={classNames({disabled: isNextDisabled})}>
                    <div className="next-button" />
                    <div>{t.nextPage}</div>
                </div>
                <div onClick={isPreviousDisabled ? undefined : goPreviousPage} className={isPreviousDisabled ? "disabled" : ""}>
                    <div className="previous-button" />
                    <div>{t.prevPage}</div>
                </div>
                <div onClick={isNextDisabled ? undefined : goCurrentPage} className={classNames({disabled: isNextDisabled})}>
                    <div className="current-button" />
                    <div>{t.currentPage}</div>
                </div>
            </div>
        </div>
    );
});
