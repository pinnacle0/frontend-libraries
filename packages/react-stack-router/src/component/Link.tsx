import React, {useContext, forwardRef, useMemo} from "react";
import {createPath} from "history";
import {RouterContext} from "../context";
import type {To} from "history";

interface Props extends Omit<React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, "href" | "ref"> {
    to: To;
}

export const Link = forwardRef<HTMLAnchorElement, Props>(({to, children, target, onClick, ...restProps}, ref) => {
    const {push} = useContext(RouterContext);
    const herf = useMemo(() => (typeof to === "string" ? to : createPath(to)), [to]);
    const handleClick: React.MouseEventHandler<HTMLAnchorElement> = event => {
        event.preventDefault();
        push(to);
        onClick?.(event);
    };

    return (
        <a {...restProps} ref={ref} href={herf} onClick={handleClick} target={to ? "_self" : target}>
            {children}
        </a>
    );
});

Link.displayName = "Link";
