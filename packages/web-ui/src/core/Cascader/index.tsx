import React from "react";
import AntCascader from "antd/es/cascader";
import type {DefaultOptionType} from "antd/es/cascader";
import type {ControlledFormValue} from "../../internal/type";
import {Nullable} from "./Nullable";
import {InitialNullable} from "./InitialNullable";
import "./index.less";
import {ReactUtil} from "../../util/ReactUtil";

/**
 * Attention:
 * CascaderDataNode.value must be unique in the whole data tree.
 */

export interface CascaderDataNode<T extends string | number> {
    label: string;
    value?: T; // Undefined if same with label
    disabled?: boolean;
    children?: Array<CascaderDataNode<T>>;
}

export interface BaseProps<T extends string | number> {
    data: Array<CascaderDataNode<T>>;
    canSelectAnyLevel?: boolean;
    placeholder?: string;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
    prefix?: React.ReactNode;
}

export interface Props<T extends string | number> extends BaseProps<T>, ControlledFormValue<T> {}
export const Cascader = ReactUtil.compound("Cascader", {Nullable, InitialNullable}, <T extends string | number>(props: Props<T>) => {
    const {data, canSelectAnyLevel, placeholder, className, style, disabled, prefix, value, onChange} = props;

    const getAntValue = (): Array<string | number> => {
        const data = getAntDataSource();
        const getCascaderValues = (data: DefaultOptionType[]): Array<string | number> => {
            for (const item of data) {
                if (item.value === value) {
                    return [item.value];
                } else if (item.children) {
                    const result = [item.value!, ...getCascaderValues(item.children)];
                    if (result.includes(value)) {
                        return result;
                    }
                }
            }
            return [];
        };
        return getCascaderValues(data);
    };

    const getAntDataSource = (): DefaultOptionType[] => {
        const getAntChildren = (list: Array<CascaderDataNode<T>>): DefaultOptionType[] => {
            return list.map(node => ({
                label: node.label,
                disabled: node.disabled,
                value: node.value || node.label,
                children: node.children && node.children.length > 0 ? getAntChildren(node.children) : undefined,
            }));
        };
        return getAntChildren(data);
    };

    const displayRender = (labels: React.ReactNode[]) => {
        if (!prefix) return labels.join("/");
        return (
            <div className="prefixed-label-wrapper">
                {prefix}
                {labels.join("/")}
            </div>
        );
    };

    return (
        <AntCascader
            multiple={false}
            className={`g-cascader ${className || ""}`}
            classNames={{popup: {root: "g-cascader-popup"}}}
            style={style}
            changeOnSelect={canSelectAnyLevel}
            value={getAntValue()}
            onChange={antValue => onChange(antValue[antValue.length - 1] as T)}
            options={getAntDataSource()}
            allowClear={false}
            expandTrigger="hover"
            displayRender={displayRender}
            placeholder={
                prefix ? (
                    <div className="prefixed-placeholder-wrapper">
                        {prefix}
                        {placeholder}
                    </div>
                ) : (
                    placeholder
                )
            }
            disabled={disabled}
        />
    );
});
