import React from "react";
import {PickOptional} from "../../internal/type";
import {FormErrorDisplayMode, FormValidationContext, FormValidationContextType} from "./context";
import {Item} from "./Item";
import "./index.less";

export interface Props {
    onFinish?: () => void; // On success submit
    id?: string;
    className?: string;
    style?: React.CSSProperties;
    onValidationStatusChange?: (isValidating: boolean) => void;
    layout?: "horizontal" | "vertical" | "inline";
    errorDisplayMode?: FormErrorDisplayMode;
}

export class Form extends React.PureComponent<Props> {
    static displayName = "Form";
    static defaultProps: PickOptional<Props> = {
        layout: "horizontal",
        errorDisplayMode: {type: "extra"},
    };
    static Item = Item;

    private readonly validationContext: FormValidationContextType;
    private validators: Array<() => Promise<boolean>> = [];

    constructor(props: Props) {
        super(props);
        this.validationContext = {
            registerValidator: validator => this.validators.push(validator),
            unregisterValidator: validator => {
                const index = this.validators.indexOf(validator);
                if (index >= 0) {
                    this.validators.splice(index, 1);
                }
            },
            errorDisplayMode: () => this.props.errorDisplayMode!,
        };
    }

    // Exposed for outer ref use, not recommended
    triggerSubmit = async () => {
        const {onFinish, onValidationStatusChange} = this.props;
        try {
            onValidationStatusChange?.(true);
            const validatorResults = await Promise.all(this.validators.map(_ => _()));
            if (validatorResults.every(_ => _)) {
                // Also true even if validatorResults is []
                onFinish?.();
                return true;
            }
            return false;
        } finally {
            onValidationStatusChange?.(false);
        }
    };

    onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        event.stopPropagation();
        await this.triggerSubmit();
    };

    render() {
        const {children, id, className, style, layout} = this.props;
        return (
            <form id={id} className={`g-form g-form-${layout} ${className || ""}`} style={style} onSubmit={this.onSubmit}>
                <FormValidationContext.Provider value={this.validationContext}>{children}</FormValidationContext.Provider>
            </form>
        );
    }
}
