import React from "react";
import AntPagination from "antd/es/pagination";
import {i18n} from "../../internal/i18n/core";
import {TextUtil} from "../../internal/TextUtil";
import "./index.less";

export interface Props {
    onPageIndexChange: (pageIndex: number) => void;
    totalCount: number; // totalCount is for display summary only, may >= totalPage * pageSize
    totalPage: number;
    pageIndex: number;
    pageSize?: number;
    onPageSizeChange?: (pageSize: number) => void;
    small?: boolean;
    renderSummary?: ((totalCount: number, pageIndex: number, totalPage: number) => React.ReactElement) | "none";
    pageSizeOptions?: string[];
    style?: React.CSSProperties;
    disabled?: boolean;
}

export class Pagination extends React.PureComponent<Props> {
    static displayName = "Pagination";

    // antd default onChange is triggered by either pageIndex, or pageSize change
    onChange = (pageIndex: number, pageSize: number) => {
        if (this.props.onPageSizeChange === undefined || pageSize === this.props.pageSize) {
            this.props.onPageIndexChange(pageIndex);
        }
    };

    onShowSizeChange = (_: number, pageSize: number) => this.props.onPageSizeChange?.(pageSize);

    renderSummary = (totalCount: number, pageIndex: number, totalPage: number) => {
        const t = i18n();
        return <div>{TextUtil.interpolate(t.paginationSummary, totalCount.toString(), pageIndex.toString(), totalPage.toString())}</div>;
    };

    render() {
        const {disabled, onPageSizeChange, totalPage, pageIndex, totalCount, small, renderSummary = this.renderSummary, pageSize = 10, pageSizeOptions} = this.props;

        // If last page is divisible by pageSize that it is full page, otherwise only use reminder as last page size.
        const lastPageSize = totalCount % pageSize === 0 ? pageSize : totalCount % pageSize;
        const totalAvailableRecords = pageSize * (totalPage - 1) + lastPageSize;

        return (
            totalCount > 0 && (
                <div className="g-pagination">
                    {renderSummary !== "none" && renderSummary(totalCount, pageIndex, totalPage)}
                    <AntPagination
                        disabled={disabled}
                        showSizeChanger={onPageSizeChange !== undefined}
                        size={small ? "small" : "default"}
                        onChange={this.onChange}
                        onShowSizeChange={this.onShowSizeChange}
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
