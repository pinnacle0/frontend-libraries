import React from "react";
import {classNames} from "../../util/ClassNames";
import {Tooltip} from "../Tooltip";
import {FormValidationContext} from "./context";
import {ReactUtil} from "../../util/ReactUtil";

export type FormValidator = () => string | null | Promise<string | null>;

export interface Props {
    children: React.ReactNode;
    label?: React.ReactElement | string | number | null;
    required?: boolean;
    extra?: React.ReactElement | string | number | null;
    validator?: FormValidator;
    className?: string;
    labelStyle?: React.CSSProperties;
    widthMode?: "fill" | "auto" | "shrink"; // No affect for <Form layout="inline">
}

const overlayStyle: React.CSSProperties = {color: "red"};

export const Item = ReactUtil.memo("Item", (props: Props) => {
    const {label, children, className, required, extra, labelStyle, widthMode, validator} = props;
    const {registerValidator, unregisterValidator, errorDisplayMode} = React.useContext(FormValidationContext);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    const validate = React.useCallback(async (): Promise<boolean> => {
        if (!validator) return true;

        const errorMessage = await validator();
        setErrorMessage(errorMessage);
        return errorMessage === null;
    }, [validator]);

    React.useEffect(() => {
        registerValidator(validate);
        return () => unregisterValidator(validate);
    }, [registerValidator, unregisterValidator, validate]);

    const childrenNode = typeof children === "number" || typeof children === "string" ? <span className="pure-text">{children}</span> : children;
    const extraMessageNode = extra && <div className="message">{extra}</div>;
    const errorDisplay = errorDisplayMode();

    return (
        <div className={classNames("g-form-item", className)}>
            <div className={classNames("g-form-item-label", {required})} style={labelStyle}>
                {label && <label>{label}</label>}
            </div>
            <div className={classNames("g-form-item-children", {"has-error": errorMessage}, widthMode ? `width-${widthMode}` : "")}>
                {errorDisplay.type === "extra" ? (
                    <React.Fragment>
                        {childrenNode}
                        {extraMessageNode}
                        {errorMessage && <div className="message error">{errorMessage}</div>}
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Tooltip title={errorMessage} open={errorMessage !== null} placement={errorDisplay.placement || "right"} color="white" styles={{container: overlayStyle}}>
                            {childrenNode}
                        </Tooltip>
                        {extraMessageNode}
                    </React.Fragment>
                )}
            </div>
        </div>
    );
});
