import React from "react";
import RcCollapse from "@rc-component/collapse";
import "@rc-component/collapse/assets/index.css";
import {ReactUtil} from "../../util/ReactUtil";

export interface CollapseItemProps {
    key: string;
    label: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    showArrow?: boolean;
    forceRender?: boolean;
    extra?: React.ReactNode;
    collapsible?: "header" | "icon" | "disabled";
}

export interface Props {
    activeKey?: string | string[];
    defaultActiveKey?: string | string[];
    onChange?: (key: string | string[]) => void;
    accordion?: boolean;
    bordered?: boolean;
    ghost?: boolean;
    expandIcon?: (panelProps: any) => React.ReactNode;
    expandIconPosition?: "start" | "end";
    destroyInactivePanel?: boolean;
    collapsible?: "header" | "icon" | "disabled";
    className?: string;
    style?: React.CSSProperties;
    items?: CollapseItemProps[];
    size?: "large" | "middle" | "small";
    children?: React.ReactNode;
}

export type CollapseItemsProps = CollapseItemProps[];

export const Collapse = ReactUtil.memo("Collapse", ({items, onChange, ...props}: Props) => {
    return (
        <RcCollapse
            onChange={onChange as any}
            items={items?.map(item => ({
                key: item.key,
                label: item.label,
                children: item.children,
                className: item.className,
                style: item.style,
                showArrow: item.showArrow,
                forceRender: item.forceRender,
                extra: item.extra,
                collapsible: item.collapsible,
            }))}
            {...props}
        />
    );
});
