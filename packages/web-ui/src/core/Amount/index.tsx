import React from "react";
import type {PickOptional} from "../../internal/type";
import {StringUtil} from "../../internal/StringUtil";
import {AmountPercentage} from "./AmountPercentage";

export interface Props {
    value: number | null | undefined;
    scale: number;
    floorRounding?: boolean;
    withPlusSignForPositive?: boolean;
    withThousandSplitter?: boolean;
    nullText?: string;
    prefix?: string;
    postfix?: string;
    colorScheme?: "green-red" | "highlight" | "highlight-for-positive";
    underline?: boolean;
    del?: boolean;
}

export class Amount extends React.PureComponent<Props> {
    static displayName = "Amount";
    static defaultProps: PickOptional<Props> = {
        withThousandSplitter: true,
        nullText: "-",
    };

    static Percentage = AmountPercentage;

    private readonly underlineStyle: React.CSSProperties = {textDecoration: "underline", cursor: "pointer"};
    private readonly greenStyle: React.CSSProperties = {color: "#1abc9b"};
    private readonly redStyle: React.CSSProperties = {color: "#eb4e36"};

    renderDecimal = (integerPart: string, fractionalPart?: string) => {
        const {prefix, postfix, del, colorScheme, underline} = this.props;
        const value = this.props.value as number; // Checked already
        const amountStyle = underline ? this.underlineStyle : {};
        let contentNode: React.ReactElement = fractionalPart ? (
            <React.Fragment>
                {integerPart}.<small>{fractionalPart}</small>
            </React.Fragment>
        ) : (
            <React.Fragment>{integerPart}</React.Fragment>
        );

        contentNode = (
            <span style={amountStyle}>
                {prefix ? prefix + " " : null}
                {contentNode}
                {postfix ? " " + postfix : null}
            </span>
        );

        if (colorScheme) {
            if (colorScheme === "green-red") {
                const coloredStyle: React.CSSProperties = {
                    ...amountStyle,
                    ...(value > 0 ? this.greenStyle : {}),
                    ...(value < 0 ? this.redStyle : {}),
                };
                contentNode = <span style={coloredStyle}>{contentNode}</span>;
            } else if (colorScheme === "highlight-for-positive") {
                contentNode = value > 0 ? <em>{contentNode}</em> : contentNode;
            } else if (colorScheme === "highlight") {
                contentNode = <em>{contentNode}</em>;
            }
        }

        if (del) {
            contentNode = <del>{contentNode}</del>;
        }

        return contentNode;
    };

    render() {
        const {value, scale, floorRounding, withThousandSplitter, withPlusSignForPositive, nullText} = this.props;
        if (value !== null && value !== undefined && Number.isFinite(value)) {
            const rounded = floorRounding ? StringUtil.numberToFloorFixed(value, scale) : value.toFixed(scale);
            const parts = rounded.split(".");
            if (withThousandSplitter) {
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
            if (withPlusSignForPositive && value > 0) {
                parts[0] = "+" + parts[0];
            }
            return this.renderDecimal(parts[0], parts[1]);
        } else {
            return nullText;
        }
    }
}
