import React from "react";
import RcCascader from "@rc-component/cascader";
import type {ControlledFormValue} from "../../internal/type";
import {Nullable} from "./Nullable";
import {InitialNullable} from "./InitialNullable";
import "./index.less";
import {ReactUtil} from "../../util/ReactUtil";

export interface CascaderDataNode<T extends string | number> {
    label: string;
    value?: T;
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

interface DefaultOptionType {
    label: string;
    value: string | number;
    disabled?: boolean;
    children?: DefaultOptionType[];
}

export interface Props<T extends string | number> extends BaseProps<T>, ControlledFormValue<T> {}

export const Cascader = ReactUtil.compound("Cascader", {Nullable, InitialNullable}, <T extends string | number>(props: Props<T>) => {
    const {data, canSelectAnyLevel, placeholder, className, style, disabled, prefix, value, onChange} = props;

    const getAntValue = (): Array<string | number> => {
        const data = getDataSource();
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

    const getDataSource = (): DefaultOptionType[] => {
        const getChildren = (list: Array<CascaderDataNode<T>>): DefaultOptionType[] => {
            return list.map(node => ({
                label: node.label,
                disabled: node.disabled,
                value: node.value || node.label,
                children: node.children && node.children.length > 0 ? getChildren(node.children) : undefined,
            }));
        };
        return getChildren(data);
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
        <RcCascader
            className={`g-cascader ${className || ""}`}
            style={style}
            changeOnSelect={canSelectAnyLevel}
            value={getAntValue()}
            onChange={(antValue: any) => onChange(antValue[antValue.length - 1] as T)}
            options={getDataSource()}
            allowClear={false}
            expandTrigger="hover"
            displayRender={displayRender as any}
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
