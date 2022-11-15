import React from "react";
import type {StringKey} from "../../internal/type";
import "./index.less";

export interface Props<T extends object> {
    data: T[];
    onClick: (item: T, index: number) => void;
    renderItem: (item: T, index: number) => React.ReactElement | string | number;
    itemKey: StringKey<T> | ((item: T, index?: number) => string) | "index";
    lastClickable?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

export class Breadcrumb<T extends object> extends React.PureComponent<Props<T>> {
    static displayName = "Breadcrumb";

    getItemKey = (item: T, index: number): string | number => {
        const {itemKey} = this.props;
        if (itemKey === "index") {
            return index;
        } else if (typeof itemKey === "function") {
            return itemKey(item, index);
        } else {
            return item[itemKey] as any;
        }
    };

    render() {
        const {data, onClick, renderItem, lastClickable, className, style} = this.props;

        return (
            <div className={`g-breadcrumb ${className || ""}`} style={style}>
                {data.map((_, index) => (
                    <div
                        onClick={lastClickable || index !== data.length - 1 ? () => onClick(_, index) : undefined}
                        key={this.getItemKey(_, index)}
                        className={lastClickable || index !== data.length - 1 ? "clickable" : ""}
                    >
                        {renderItem(_, index)}
                    </div>
                ))}
            </div>
        );
    }
}
