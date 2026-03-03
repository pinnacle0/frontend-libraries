import React from "react";
import classNames from "classnames";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props {
    title?: React.ReactNode;
    extra?: React.ReactNode;
    bordered?: boolean;
    hoverable?: boolean;
    size?: "default" | "small";
    cover?: React.ReactNode;
    actions?: React.ReactNode[];
    className?: string;
    style?: React.CSSProperties;
    styles?: {header?: React.CSSProperties; body?: React.CSSProperties; actions?: React.CSSProperties};
    children?: React.ReactNode;
}

interface GridProps {
    hoverable?: boolean;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

const cardStyle: React.CSSProperties = {
    border: "1px solid #f0f0f0",
    borderRadius: 8,
    background: "#fff",
    fontSize: 14,
};

const headStyle: React.CSSProperties = {
    padding: "0 24px",
    borderBottom: "1px solid #f0f0f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 56,
    fontWeight: 600,
    fontSize: 16,
};

const bodyStyle: React.CSSProperties = {padding: 24};

const CardGrid = ({hoverable, className, style, children}: GridProps) => (
    <div
        className={classNames("g-card-grid", className)}
        style={{
            padding: 24,
            borderRight: "1px solid #f0f0f0",
            borderBottom: "1px solid #f0f0f0",
            transition: hoverable ? "box-shadow 0.3s" : undefined,
            float: "left",
            ...style,
        }}
    >
        {children}
    </div>
);

export const Card = ReactUtil.compound("Card", {Grid: CardGrid}, (props: Props) => {
    const {title, extra, bordered = true, hoverable, size, cover, actions, className, style, styles: customStyles, children} = props;
    return (
        <div
            className={classNames("g-card", className, {"g-card-hoverable": hoverable})}
            style={{...cardStyle, ...(bordered ? {} : {border: "none"}), ...(hoverable ? {cursor: "pointer"} : {}), ...style}}
        >
            {(title || extra) && (
                <div style={{...headStyle, ...(size === "small" ? {padding: "0 12px", minHeight: 38, fontSize: 14} : {}), ...customStyles?.header}}>
                    <div>{title}</div>
                    {extra && <div>{extra}</div>}
                </div>
            )}
            {cover && <div>{cover}</div>}
            <div style={{...bodyStyle, ...(size === "small" ? {padding: 12} : {}), ...customStyles?.body}}>{children}</div>
            {actions && actions.length > 0 && (
                <div style={{display: "flex", borderTop: "1px solid #f0f0f0", ...customStyles?.actions}}>
                    {actions.map((action, i) => (
                        <div key={i} style={{flex: 1, textAlign: "center", padding: "12px 0", borderRight: i < actions.length - 1 ? "1px solid #f0f0f0" : undefined}}>
                            {action}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
});
