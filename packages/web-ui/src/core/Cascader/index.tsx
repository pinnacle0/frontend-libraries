import AntCascader, {CascaderOptionType} from "antd/lib/cascader";
import "antd/lib/cascader/style";
import React from "react";
import {i18n} from "../../internal/i18n/core";
import {ControlledFormValue, PickOptional, SafeReactChild} from "../../internal/type";
import "./index.less";

export interface CascaderDataNode<T> {
    label: string;
    value?: T;
    disabled?: boolean;
    children?: Array<CascaderDataNode<T>>;
}

export interface Props<T> extends ControlledFormValue<T> {
    data: Array<CascaderDataNode<T>>;
    canSelectAnyLevel?: boolean;
    placeholder?: string;
    style?: React.CSSProperties;
    prefix?: SafeReactChild;
}

export class Cascader<T extends string | null> extends React.PureComponent<Props<T>> {
    static displayName = "Cascader";

    static defaultProps: PickOptional<Props<any>> = {
        canSelectAnyLevel: false,
    };

    getAntValue = (): Array<string | number> => {
        const data = this.getAntDataSource();
        const getCascaderValues = (data: CascaderOptionType[]): Array<string | number> => {
            const {value} = this.props;
            for (const item of data) {
                if (item.value === value) {
                    return [item.value!];
                } else if (item.children) {
                    const result = [item.value!, ...getCascaderValues(item.children)];
                    if (result.includes(value! as any)) {
                        return result;
                    }
                }
            }

            return [];
        };
        return getCascaderValues(data);
    };

    getAntDataSource = (): CascaderOptionType[] => {
        const getAntChildren = (list: Array<CascaderDataNode<T>>): CascaderOptionType[] => {
            return list.map(node => ({
                ...node,
                value: node.value === undefined ? node.label : (node.value as any),
                children: node.children ? getAntChildren(node.children) : undefined,
            }));
        };
        return getAntChildren(this.props.data);
    };

    displayRender = (label: string[], selectedOptions?: CascaderOptionType[]): SafeReactChild => {
        const t = i18n();
        const {placeholder = t.pleaseSelect, prefix} = this.props;
        const isNullValue = this.getAntValue().length === 0;
        return (
            <span className={`g-cascader-label ${isNullValue ? "null-value" : ""}`}>
                {prefix && <span className="g-cascader-prefix">{prefix}</span>}
                <span>{isNullValue ? placeholder : label.join("/")}</span>
            </span>
        );
    };

    onChange = (antValue: Array<string | number>) => {
        this.props.onChange(antValue[antValue.length - 1] as any);
    };

    render() {
        const {canSelectAnyLevel, placeholder, style} = this.props;
        return (
            <AntCascader
                className="g-cascader"
                style={style}
                changeOnSelect={canSelectAnyLevel}
                value={this.getAntValue()}
                onChange={this.onChange}
                options={this.getAntDataSource()}
                allowClear={false}
                expandTrigger="hover"
                displayRender={this.displayRender}
                placeholder="" // Note: the actual placeholder is inside displayRender
            />
        );
    }
}
