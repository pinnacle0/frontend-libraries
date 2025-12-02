import React from "react";
import {classNames} from "../../util/ClassNames";
import {Tooltip} from "../Tooltip";
import "./index.less";
import {ReactUtil} from "../../util/ReactUtil";

interface Props {
    children: React.ReactNode;
    maxWidth: number;
    className?: string;
    style?: React.CSSProperties;
}

export const OverflowableText = ReactUtil.memo("OverflowableText", ({children, style, maxWidth, className}: Props) => {
    const [overflow, setOverflow] = React.useState(false);
    const textRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        setOverflow((textRef.current && textRef.current.scrollWidth > maxWidth) || false);
    }, [children, maxWidth]);

    return (
        <div className={classNames("g-overflowable-text", className)}>
            {overflow ? (
                <Tooltip overlay={children} childContainerProps={{className: "wrap-text", style: {width: maxWidth, ...style}}}>
                    {children}
                </Tooltip>
            ) : (
                <div style={{display: "inline-block", ...style}}>{children}</div>
            )}
            <div ref={textRef} style={{maxWidth}} className="shadow-text">
                {children}
            </div>
        </div>
    );
});
