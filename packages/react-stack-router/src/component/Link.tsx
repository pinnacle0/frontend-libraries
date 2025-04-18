import type {FunctionComponent} from "react";
import React, {use, useMemo} from "react";
import {createPath} from "history";
import {RouterContext} from "../context";
import type {To} from "history";

interface Props extends Omit<React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, "href"> {
    to: To;
    replace?: boolean;
    state?: any;
}

export const Link: FunctionComponent<Props> = ({to, children, target, onClick, replace: isReplace, state, ref, ...restProps}) => {
    const {push, replace} = use(RouterContext);
    const href = useMemo(() => (typeof to === "string" ? to : createPath(to)), [to]);
    const handleClick: React.MouseEventHandler<HTMLAnchorElement> = event => {
        event.preventDefault();
        isReplace ? replace(to, state) : push(to, state);
        onClick?.(event);
    };

    return (
        <a {...restProps} ref={ref} href={href} onClick={handleClick} target={to ? "_self" : target}>
            {children}
        </a>
    );
};

Link.displayName = "Link";
