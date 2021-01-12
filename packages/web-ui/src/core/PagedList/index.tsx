import React from "react";
import {i18n} from "../../internal/i18n/core";
import type {StringKey} from "../../internal/type";
import "./index.less";

export interface Props<T extends object> {
    dataSource: T[];
    rowKey: StringKey<T> | ((record: T, index: number) => string) | "index";
    renderItem: React.ComponentType<{item: T; index: number}>;
    itemWidth: number;
    pageSize: number;
}

interface State {
    currentItemIndex: number;
}

export class PagedList<T extends object> extends React.PureComponent<Props<T>, State> {
    static displayName = "PagedList";

    constructor(props: Props<T>) {
        super(props);
        this.state = {
            currentItemIndex: 0,
        };
    }

    getUpperLimit = () => this.props.dataSource.length - this.props.pageSize;

    goPreviousPage = () => {
        const {pageSize} = this.props;
        const {currentItemIndex} = this.state;
        this.setState({currentItemIndex: Math.max(0, Math.min(currentItemIndex + pageSize, this.getUpperLimit()))});
    };

    goNextPage = () => {
        const {pageSize} = this.props;
        const {currentItemIndex} = this.state;
        this.setState({currentItemIndex: Math.max(0, currentItemIndex - pageSize)});
    };

    goCurrentPage = () => this.setState({currentItemIndex: 0});

    getRowKey = (record: T, index: number): string | number => {
        const {rowKey} = this.props;
        if (rowKey === "index") {
            return index;
        } else if (typeof rowKey === "function") {
            return rowKey(record, index);
        } else {
            return record[rowKey] as any;
        }
    };

    render() {
        const {dataSource, renderItem, itemWidth, pageSize} = this.props;
        const {currentItemIndex} = this.state;
        const isNextDisabled = currentItemIndex === 0;
        const isPreviousDisabled = currentItemIndex >= this.getUpperLimit();
        const t = i18n();
        const Component = renderItem;

        return (
            <div className="g-paged-list">
                <div className="list-wrap" style={{width: itemWidth * pageSize}}>
                    <div className="list" style={{transform: `translateX(${currentItemIndex * itemWidth}px)`}}>
                        {dataSource.map((_, index) => (
                            <div style={{flex: `0 0 ${itemWidth}px`}} key={this.getRowKey(_, index)}>
                                <Component index={index} item={_} />
                            </div>
                        ))}
                    </div>
                    {dataSource.length === 0 && <div className="no-data">{t.noData}</div>}
                </div>
                <div className="navigation">
                    <div onClick={isNextDisabled ? undefined : this.goNextPage} className={isNextDisabled ? "disabled" : ""}>
                        <div className="next-button" />
                        <div>{t.nextPage}</div>
                    </div>
                    <div onClick={isPreviousDisabled ? undefined : this.goPreviousPage} className={isPreviousDisabled ? "disabled" : ""}>
                        <div className="previous-button" />
                        <div>{t.prevPage}</div>
                    </div>
                    <div onClick={isNextDisabled ? undefined : this.goCurrentPage} className={isNextDisabled ? "disabled" : ""}>
                        <div className="current-button" />
                        <div>{t.currentPage}</div>
                    </div>
                </div>
            </div>
        );
    }
}
