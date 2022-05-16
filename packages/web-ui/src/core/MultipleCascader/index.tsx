import React from "react";
import AntCascader from "antd/lib/cascader";
import {classNames} from "../../util/ClassNames";
import type {ControlledFormValue} from "../../internal/type";
import type {DefaultOptionType} from "rc-cascader";
import "antd/lib/cascader/style";
import "./index.less";

/**
 * Attention:
 * CascaderDataNode.value must be unique in the whole data tree.
 */

export interface CascaderDataNode<T extends string | number> {
    label: string; // Label must be unique
    value: T | Array<CascaderDataNode<T>>;
    disabled?: boolean;
}

export interface BaseProps<T extends string | number> {
    data: CascaderDataNode<T>[];
    placeholder?: string;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}

export interface Props<T extends string | number> extends BaseProps<T>, ControlledFormValue<T[]> {}

export class MultipleCascader<T extends string | number> extends React.PureComponent<Props<T>> {
    static displayName = "MultipleCascader";
    static nonLeafPrefix = "@@NON_LEAF_";

    getAntValue = (): (string | number)[][] => {
        const data = this.getAntDataSource();
        const value = this.props.value;
        const getCascaderValues = (data: DefaultOptionType[], value: T): Array<string | number> => {
            for (const item of data) {
                if (item.value === value) {
                    return [item.value];
                } else if (item.children) {
                    const result = [item.value!, ...getCascaderValues(item.children, value)];
                    if (result.includes(value)) {
                        return result;
                    }
                }
            }
            return [];
        };

        return value.map(_ => getCascaderValues(data, _));
    };

    getAntDataSource = (): DefaultOptionType[] => {
        const getAntChildren = (list: Array<CascaderDataNode<T>>): DefaultOptionType[] => {
            return list.map((node, index) => ({
                label: node.label,
                disabled: node.disabled,
                value: Array.isArray(node.value) ? MultipleCascader.nonLeafPrefix + `${index}_` + node.label : node.value,
                children: Array.isArray(node.value) && node.value.length > 0 ? getAntChildren(node.value) : undefined,
            }));
        };
        return getAntChildren(this.props.data);
    };

    onChange = (antValue: (string | number)[][]) => {
        const data = this.getAntDataSource();
        const lastNodes = antValue.map(_ => _[_.length - 1]);
        const branches = lastNodes.filter(_ => `${_}`.startsWith(MultipleCascader.nonLeafPrefix));
        const leaves = lastNodes.filter(_ => !`${_}`.startsWith(MultipleCascader.nonLeafPrefix));

        const recursion = (data: DefaultOptionType): (string | number)[] => {
            if (data.children) {
                return data.children.flatMap(recursion);
            }
            return [data.value!];
        };
        const getLeafValue = (data: DefaultOptionType[], value: string): (string | number)[] => {
            for (const item of data) {
                if (item.value === value) {
                    return recursion(item);
                } else if (item.children) {
                    const result = getLeafValue(item.children, value);
                    if (result.length) {
                        return result;
                    }
                }
            }
            return [];
        };

        this.props.onChange([...leaves, ...branches.flatMap(_ => getLeafValue(data, _ as string))] as T[]);
    };

    render() {
        const {placeholder = "", disabled, style, className} = this.props;
        return (
            <AntCascader
                multiple
                className={classNames("g-multiple-cascader", className)}
                dropdownClassName="g-multiple-cascader-popup"
                style={style}
                value={this.getAntValue()}
                onChange={this.onChange}
                options={this.getAntDataSource()}
                placeholder={placeholder}
                disabled={disabled}
                expandTrigger="hover"
                allowClear
                maxTagCount="responsive"
            />
        );
    }
}
