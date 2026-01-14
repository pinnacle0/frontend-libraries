import React from "react";
import {Input} from "../../core/Input";
import type {FormHandler} from "../../core/Form";
import {Form} from "../../core/Form";
import {Markdown} from "../../core/Markdown";
import {classNames} from "../ClassNames";
import type {PromptConfig, PromptResult} from "./index";
import "./index.less";
import {ReactUtil} from "../ReactUtil";

export interface PromptBodyHandler {
    validateForm: () => Promise<PromptResult>;
}

export interface Props extends PromptConfig {}

const warningStyle: React.CSSProperties = {marginTop: 8, color: "red"};
const formStyle: React.CSSProperties = {marginTop: 12};

export const PromptBody = ReactUtil.memo(
    "PromptBody",
    React.forwardRef(({body, warning, inputPlaceholder, inputType, initialInputValue, inputValidator}: Props, forwardRef) => {
        const [textValue, setTextValue] = React.useState(initialInputValue || "");
        const formRef = React.useRef<FormHandler>(null);

        React.useImperativeHandle(forwardRef, () => ({
            validateForm: async (): Promise<PromptResult> => {
                const validationPassed = await formRef.current!.triggerSubmit();
                if (validationPassed) return {value: textValue};
                return null;
            },
        }));

        return (
            <div className={classNames("g-modal-prompt-body", inputType)}>
                <Markdown>{body}</Markdown>
                <p style={warningStyle}>{warning}</p>
                <Form ref={formRef} style={formStyle} buttonRenderer={null}>
                    <Form.Item validator={() => inputValidator?.(textValue) || null}>
                        {inputType === "multi-line" ? (
                            <Input.TextArea placeholder={inputPlaceholder} value={textValue} onChange={setTextValue} />
                        ) : (
                            <Input type={inputType === "password" ? "password" : "text"} autoComplete="new-password" placeholder={inputPlaceholder} value={textValue} onChange={setTextValue} />
                        )}
                    </Form.Item>
                </Form>
            </div>
        );
    })
);
