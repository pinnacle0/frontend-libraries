import React from "react";
import {NavLink as ReactRouterLink} from "react-router-dom";
import {classNames} from "../../util/ClassNames";
import type {Location} from "history";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props {
    children: React.ReactNode;
    to?: string | (() => void) | Location;
    className?: string; // class "g-text-link" will be added if children is pure string
    style?: React.CSSProperties;
    newTab?: boolean; // Default value: If `to` is local (start with /), then false; Else true
    replace?: boolean; // Only work when `to` is local path or LocationDescriptorObject
}

export const Link = ReactUtil.memo("Link", ({to, children, newTab, replace, className, style}: Props) => {
    const fullClassNames: string = classNames(
        {
            "g-text-link": typeof children === "string" || typeof children === "number",
        },
        className
    );

    if (typeof to === "object") {
        return (
            <ReactRouterLink to={to} replace={replace} className={fullClassNames} style={style}>
                {children}
            </ReactRouterLink>
        );
    } else if (typeof to === "string") {
        if (to.startsWith("/")) {
            return (
                <ReactRouterLink to={to} target={!newTab ? "_self" : "_blank"} replace={replace} className={fullClassNames} style={style}>
                    {children}
                </ReactRouterLink>
            );
        } else {
            return (
                <a href={to} target={newTab === undefined || newTab ? "_blank" : "_self"} className={fullClassNames} style={style}>
                    {children}
                </a>
            );
        }
    } else {
        return (
            <a onClick={to} className={fullClassNames} style={style}>
                {children}
            </a>
        );
    }
});
