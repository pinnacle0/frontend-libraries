import React from "react";
import "./index.less";
import {classNames} from "../../util/ClassNames";

/**
 * In most cases, preset size/color styles may not match your real requirement.
 * Please over-write the CSS for each color/size in your global CSS.
 *
 * You can also extends the color/size spectrum by following:
 *      type MyColor = ButtonColor | "version1" | "version2";
 *      const MyButton = (props: Props<MyColor>) => <Button {...props} />;
 *
 * If we change Props<Color extends string = ButtonColor>, it will lose the type-checking for original Button.
 */
export type ButtonSize = "small" | "medium" | "large" | "x-large";
export type ButtonColor = "primary" | "wire-frame" | "green" | "red";

/**
 * This typing is needed for customization of ButtonColor and ButtonSize, since a customized color is actually widening, therefore we cannot use extends, because extends means subset of for type literals
 *
 * Truth side ButtonColor is for type hinting only, such that Typescript can factor out ButtonColor before the conditional is actually resolved.
 * (Although ButtonColor extends ExtraColor should have the same effect, but doesn't)
 */
type ExtendableColor<ExtraColor extends string> = ButtonColor extends ExtraColor ? ExtraColor | ButtonColor : ButtonColor;
type ExtendableSize<ExtraSize extends string> = ButtonSize extends ExtraSize ? ExtraSize | ButtonSize : ButtonSize;

export interface Props<Color extends string, Size extends string = ButtonSize> extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /** Color of button */
    color?: ExtendableColor<Color>;
    /** Size of button */
    size?: ExtendableSize<Size>;
}

export function Button<Color extends string, Size extends string = ButtonSize>({children, color, size, className = "", type = "button", ...restProps}: Props<Color, Size>) {
    return (
        <button className={classNames("g-button", {color: color ?? "primary", size: size ?? "medium"}, className)} type={type} {...restProps}>
            {children}
        </button>
    );
}
