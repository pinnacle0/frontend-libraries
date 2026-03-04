import React from "react";
import RcCascader from "@rc-component/cascader";
import "@rc-component/cascader/assets/index.less";
import {classNames} from "../../util/ClassNames";
import type {ControlledFormValue} from "../../internal/type";
import "./index.less";
import {ReactUtil} from "../../util/ReactUtil";

export interface CascaderDataNode<T extends string | number> {
    label: string;
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

interface DefaultOptionType {
    label: string;
    value: string | number;
    disabled?: boolean;
    children?: DefaultOptionType[];
}

export interface Props<T extends string | number> extends BaseProps<T>, ControlledFormValue<T[]> {}

const NON_LEAF_PREFIX = "@@NON_LEAF_";

export const MultipleCascader = ReactUtil.memo("MultipleCascader", <T extends string | number>({value, placeholder = "", disabled, style, className, onChange, data}: Props<T>) => {
    const getAntValue = (): (string | number)[][] => {
        const data = getDataSource();
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

    const getDataSource = (): DefaultOptionType[] => {
        const getChildren = (list: Array<CascaderDataNode<T>>): DefaultOptionType[] => {
            return list.map((node, index) => ({
                label: node.label,
                disabled: node.disabled,
                value: Array.isArray(node.value) ? NON_LEAF_PREFIX + `${index}_` + node.label : (node.value as string | number),
                children: Array.isArray(node.value) && node.value.length > 0 ? getChildren(node.value) : undefined,
            }));
        };
        return getChildren(data);
    };

    const onCascaderChange = (antValue: (string | number | null)[][]) => {
        const lastNodes = antValue.map(_ => _[_.length - 1]);
        const branches = lastNodes.filter(_ => `${_}`.startsWith(NON_LEAF_PREFIX));
        const leaves = lastNodes.filter(_ => !`${_}`.startsWith(NON_LEAF_PREFIX));

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

        const newData = getDataSource();
        onChange([...leaves, ...branches.flatMap(_ => getLeafValue(newData, _ as string))] as T[]);
    };

    return (
        <RcCascader
            checkable
            className={classNames("g-multiple-cascader", className)}
            style={style}
            value={getAntValue() as any}
            onChange={onCascaderChange as any}
            options={getDataSource()}
            placeholder={placeholder}
            disabled={disabled}
            expandTrigger="hover"
            allowClear
            maxTagCount="responsive"
        />
    );
});
