import React from "react";
import AntPagination from "antd/lib/pagination";
import "antd/lib/pagination/style";
import {i18n} from "../../internal/i18n/core";
import "./index.less";
import {StringUtil} from "../../internal/StringUtil";

export interface Props {
    onChange: (pageIndex: number) => void;
    totalCount: number;
    totalPage: number;
    pageIndex: number;
    pageSize?: number;
    onShowSizeChange?: (pageIndex: number, pageSize: number) => void;
    small?: boolean;
    renderSummary?: ((totalCount: number, pageIndex: number, totalPage: number) => React.ReactElement) | "none";
    pageSizeOptions?: string[];
    style?: React.CSSProperties;
}

export class Pagination extends React.PureComponent<Props> {
    static displayName = "Pagination";

    onChange = (pageIndex: number, pageSize?: number) => {
        // TO prevent onChange triggered again by page-size change, in 4.5+ Antd version
        if (this.props.onShowSizeChange === undefined || pageSize === this.props.pageSize) {
            this.props.onChange(pageIndex);
        }
    };

    renderSummary = (totalCount: number, pageIndex: number, totalPage: number) => {
        const t = i18n();
        return <div>{StringUtil.interpolate(t.paginationSummary, totalCount.toString(), pageIndex.toString(), totalPage.toString())}</div>;
    };

    render() {
        const {onShowSizeChange, totalPage, pageIndex, totalCount, small, renderSummary = this.renderSummary, pageSize = 10, pageSizeOptions} = this.props;
        // If last page is divisible by pageSize that it is full page, otherwise only use reminder as last page size.
        const lastPageSize = totalCount % pageSize === 0 ? pageSize : totalCount % pageSize;
        const totalAvailableRecords = pageSize * (totalPage - 1) + lastPageSize;
        return (
            totalCount > 0 && (
                <div className="g-pagination">
                    {renderSummary !== "none" && renderSummary(totalCount, pageIndex, totalPage)}
                    <AntPagination
                        showSizeChanger={onShowSizeChange !== undefined}
                        onShowSizeChange={onShowSizeChange}
                        size={small ? "small" : "default"}
                        onChange={this.onChange}
                        current={pageIndex}
                        pageSize={pageSize}
                        total={totalAvailableRecords}
                        pageSizeOptions={pageSizeOptions}
                    />
                </div>
            )
        );
    }
}
