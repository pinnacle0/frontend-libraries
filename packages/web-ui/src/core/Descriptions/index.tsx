import React from "react";
import AntDescriptions from "antd/es/descriptions";
import "./index.less";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props {
    children: React.ReactNode;
    horizontal?: boolean;
    title?: string;
    column?: number; // If undefined, column length will be same as children's length
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

export const Descriptions = ReactUtil.compound("Descriptions", {Item: (props: DescriptionsItemProps) => <AntDescriptions.Item {...props} />}, (props: Props) => {
    const {horizontal, column, title, children, className, style, bordered = true} = props;
    const columnCount = column || React.Children.count(children);
    return (
        <AntDescriptions style={{...containerStyle, ...style}} className={className} layout={horizontal ? "horizontal" : "vertical"} bordered={bordered} title={title} column={columnCount}>
            {children}
        </AntDescriptions>
    );
});
