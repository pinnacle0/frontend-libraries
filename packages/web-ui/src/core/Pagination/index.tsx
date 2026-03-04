import React from "react";
import RcPagination from "@rc-component/pagination";
import "@rc-component/pagination/assets/index.less";
import {i18n} from "../../internal/i18n/core";
import {TextUtil} from "../../internal/TextUtil";
import "./index.less";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props {
    onPageIndexChange: (pageIndex: number) => void;
    totalCount: number;
    totalPage: number;
    pageIndex: number;
    pageSize?: number;
    onPageSizeChange?: (pageSize: number) => void;
    small?: boolean;
    renderSummary?: ((totalCount: number, pageIndex: number, totalPage: number) => React.ReactElement) | "none";
    pageSizeOptions?: number[];
    style?: React.CSSProperties;
    disabled?: boolean;
}

export const Pagination = ReactUtil.memo("Pagination", (props: Props) => {
    const {disabled, onPageSizeChange, totalPage, pageIndex, totalCount, renderSummary = defaultRenderSummary, pageSize = 10, pageSizeOptions, onPageIndexChange} = props;

    const onChange = (newPageIndex: number, newPageSize: number) => {
        if (onPageSizeChange === undefined || newPageSize === pageSize) {
            onPageIndexChange(newPageIndex);
        }
    };

    const onShowSizeChange = (_: number, newPageSize: number) => onPageSizeChange?.(newPageSize);

    const lastPageSize = totalCount % pageSize === 0 ? pageSize : totalCount % pageSize;
    const totalAvailableRecords = pageSize * (totalPage - 1) + lastPageSize;

    return (
        totalCount > 0 && (
            <div className="g-pagination">
                {renderSummary !== "none" && renderSummary(totalCount, pageIndex, totalPage)}
                <RcPagination
                    disabled={disabled}
                    showSizeChanger={onPageSizeChange !== undefined}
                    onChange={onChange}
                    onShowSizeChange={onShowSizeChange}
                    current={pageIndex}
                    pageSize={pageSize}
                    total={totalAvailableRecords}
                    pageSizeOptions={pageSizeOptions}
                />
            </div>
        )
    );
});

function defaultRenderSummary(totalCount: number, pageIndex: number, totalPage: number) {
    const t = i18n();
    return <div>{TextUtil.interpolate(t.paginationSummary, totalCount.toString(), pageIndex.toString(), totalPage.toString())}</div>;
}
