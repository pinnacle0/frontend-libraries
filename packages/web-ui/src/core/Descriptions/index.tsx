import React from "react";
import AntDescriptions from "antd/lib/descriptions";
import "antd/lib/descriptions/style";
import type {PickOptional} from "../../internal/type";
import "./index.less";

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

export class Descriptions extends React.PureComponent<Props> {
    static defaultProps: PickOptional<Props> = {
        bordered: true,
    };

    static displayName = "Descriptions";

    static Item = (props: DescriptionsItemProps) => <AntDescriptions.Item {...props} />;

    private readonly containerStyle: React.CSSProperties = {marginBottom: 15};

    render() {
        const {horizontal, column, title, children, className, style, bordered} = this.props;
        const columnCount = column || React.Children.count(children);
        return (
            <AntDescriptions style={{...this.containerStyle, ...style}} className={className} layout={horizontal ? "horizontal" : "vertical"} bordered={bordered} title={title} column={columnCount}>
                {children}
            </AntDescriptions>
        );
    }
}
