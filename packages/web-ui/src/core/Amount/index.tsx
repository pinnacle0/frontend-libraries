import React from "react";
import type {PickOptional} from "../../internal/type";
import {NumberUtil} from "../../internal/NumberUtil";
import {AmountPercentage} from "./AmountPercentage";
import "./index.less";

export interface Props {
    value: number | null | undefined;
    scale: number; // Range [0, 10]
    rounding?: "floor" | "ceil" | "round";
    plusSignForPositive?: boolean;
    thousandSplitter?: boolean;
    nullText?: string;
    prefix?: string;
    postfix?: string;
    colorScheme?: "green+red-" | "highlight" | "highlight+" | "green-red+" | "highlight-green";
    bold?: boolean;
    underline?: boolean;
    del?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

export class Amount extends React.PureComponent<Props> {
    static displayName = "Amount";
    static defaultProps: PickOptional<Props> = {
        rounding: "round",
        thousandSplitter: true,
        nullText: "-",
    };

    static Percentage = AmountPercentage;

    render() {
        const {value, scale, rounding, thousandSplitter, plusSignForPositive, prefix, postfix, colorScheme, bold, del, underline, style, className, nullText} = this.props;
        if (value !== null && value !== undefined && Number.isFinite(value)) {
            const roundedString = NumberUtil.roundingToString(value, rounding!, scale);
            const parts = roundedString.split(".");
            if (thousandSplitter) {
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
            if (plusSignForPositive && value > 0) {
                parts[0] = "+" + parts[0];
            }

            const classNames = ["g-amount"];
            if (bold) classNames.push("bold");
            if (del) classNames.push("del");
            if (underline) classNames.push("underline");
            if (className) classNames.push(className);

            if (colorScheme === "green+red-") {
                if (value > 0) classNames.push("color-green");
                if (value < 0) classNames.push("color-red");
            } else if (colorScheme === "green-red+") {
                if (value > 0) classNames.push("color-red");
                if (value < 0) classNames.push("color-green");
            } else if (colorScheme === "highlight") {
                classNames.push("color-highlight");
            } else if (colorScheme === "highlight+") {
                if (value > 0) classNames.push("color-highlight");
            } else if (colorScheme === "highlight-green") {
                classNames.push("color-green");
            }

            return (
                <div className={classNames.join(" ")} style={style}>
                    {prefix && <div className="prefix">{prefix}</div>}
                    <div className="digits">
                        {parts[0]}
                        {parts[1] && (
                            <React.Fragment>
                                .<small>{parts[1]}</small>
                            </React.Fragment>
                        )}
                    </div>
                    {postfix && <div className="postfix">{postfix}</div>}
                </div>
            );
        } else {
            return nullText;
        }
    }
}
