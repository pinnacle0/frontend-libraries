import React from "react";
import classNames from "classnames";
import "./index.less";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props {
    children: React.ReactNode;
    horizontal?: boolean;
    title?: string;
    column?: number;
    className?: string;
    style?: React.CSSProperties;
    bordered?: boolean;
}

export interface DescriptionsItemProps {
    label: React.ReactElement | string | number;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    span?: number;
}

const containerStyle: React.CSSProperties = {marginBottom: 15};

const ItemComponent = ({label, children, className, style, span}: DescriptionsItemProps) => (
    <td className={classNames("g-descriptions-item", className)} style={style} colSpan={span}>
        <span className="g-descriptions-item-label" style={{fontWeight: 600, marginRight: 8, color: "rgba(0,0,0,0.88)"}}>
            {label}
        </span>
        <span className="g-descriptions-item-content">{children}</span>
    </td>
);

export const Descriptions = ReactUtil.compound("Descriptions", {Item: ItemComponent}, (props: Props) => {
    const {horizontal, column, title, children, className, style, bordered = true} = props;
    const items = React.Children.toArray(children);
    const columnCount = column || items.length;

    if (horizontal) {
        const rows: React.ReactNode[][] = [];
        let currentRow: React.ReactNode[] = [];
        items.forEach((item, i) => {
            currentRow.push(item);
            if (currentRow.length >= columnCount || i === items.length - 1) {
                rows.push(currentRow);
                currentRow = [];
            }
        });

        return (
            <div className={classNames("g-descriptions", className)} style={{...containerStyle, ...style}}>
                {title && <div style={{fontWeight: 600, fontSize: 16, marginBottom: 16}}>{title}</div>}
                <table style={{width: "100%", borderCollapse: "collapse", ...(bordered ? {border: "1px solid #f0f0f0"} : {})}}>
                    <tbody>
                        {rows.map((row, ri) => (
                            <tr key={ri} style={bordered ? {borderBottom: "1px solid #f0f0f0"} : {}}>
                                {row.map((item, ci) => {
                                    if (!React.isValidElement(item)) return <td key={ci}>{item}</td>;
                                    const {label, children: content, span, className: itemClassName} = item.props as DescriptionsItemProps;
                                    return (
                                        <React.Fragment key={ci}>
                                            <th
                                                style={{
                                                    padding: "12px 16px",
                                                    background: bordered ? "#fafafa" : undefined,
                                                    fontWeight: 600,
                                                    textAlign: "left",
                                                    ...(bordered ? {border: "1px solid #f0f0f0"} : {}),
                                                }}
                                                colSpan={1}
                                            >
                                                {label}
                                            </th>
                                            <td style={{padding: "12px 16px", ...(bordered ? {border: "1px solid #f0f0f0"} : {})}} colSpan={span || 1} className={itemClassName}>
                                                {content}
                                            </td>
                                        </React.Fragment>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className={classNames("g-descriptions", className)} style={{...containerStyle, ...style}}>
            {title && <div style={{fontWeight: 600, fontSize: 16, marginBottom: 16}}>{title}</div>}
            <table style={{width: "100%", borderCollapse: "collapse", ...(bordered ? {border: "1px solid #f0f0f0"} : {})}}>
                <tbody>
                    <tr style={bordered ? {borderBottom: "1px solid #f0f0f0"} : {}}>
                        {items.map((item, i) => {
                            if (!React.isValidElement(item)) return <th key={i}>{item}</th>;
                            const {label, span} = item.props as DescriptionsItemProps;
                            return (
                                <th
                                    key={i}
                                    style={{padding: "12px 16px", background: bordered ? "#fafafa" : undefined, fontWeight: 600, textAlign: "left", ...(bordered ? {border: "1px solid #f0f0f0"} : {})}}
                                    colSpan={span || 1}
                                >
                                    {label}
                                </th>
                            );
                        })}
                    </tr>
                    <tr>
                        {items.map((item, i) => {
                            if (!React.isValidElement(item)) return <td key={i}>{item}</td>;
                            const {children: content, span, className: itemClassName, style: itemStyle} = item.props as DescriptionsItemProps;
                            return (
                                <td key={i} style={{padding: "12px 16px", ...(bordered ? {border: "1px solid #f0f0f0"} : {}), ...itemStyle}} colSpan={span || 1} className={itemClassName}>
                                    {content}
                                </td>
                            );
                        })}
                    </tr>
                </tbody>
            </table>
        </div>
    );
});
