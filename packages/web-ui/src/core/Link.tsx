import React from "react";
import {NavLink as ReactRouterLink} from "react-router-dom";
import {LocationDescriptorObject} from "history";
import {SafeReactChild} from "../internal/type";

export interface Props {
    to: string | (() => void) | LocationDescriptorObject<any>;
    children: SafeReactChild;
    className?: string; // class "g-text-link" will be added if children is pure string
    style?: React.CSSProperties;
    newTab?: boolean; // Default value: If `to` is local (start with /), then false; Else true
    replace?: boolean; // Only work when `to` is local path or LocationDescriptorObject
}

export class Link extends React.PureComponent<Props> {
    static displayName = "Link";

    render() {
        const {to, children, newTab, replace, className, style} = this.props;
        const fullClassNames: string[] = [];
        if (typeof children === "string" || typeof children === "number") {
            fullClassNames.push("g-text-link");
        }

        if (className) {
            fullClassNames.push(className);
        }

        if (typeof to === "object") {
            return (
                <ReactRouterLink to={to} replace={replace} className={fullClassNames.join(" ")} style={style}>
                    {children}
                </ReactRouterLink>
            );
        } else if (typeof to === "string") {
            if (to.startsWith("/")) {
                return (
                    <ReactRouterLink to={to} target={!newTab ? "_self" : "_blank"} replace={replace} className={fullClassNames.join(" ")} style={style}>
                        {children}
                    </ReactRouterLink>
                );
            } else {
                return (
                    <a href={to} target={newTab === undefined || newTab ? "_blank" : "_self"} className={fullClassNames.join(" ")} style={style}>
                        {children}
                    </a>
                );
            }
        } else {
            return (
                <a onClick={to} className={fullClassNames.join(" ")} style={style}>
                    {children}
                </a>
            );
        }
    }
}
