import {ModalUtil} from "../ModalUtil";
import {PromptBody} from "./PromptBody";
import React from "react";

export type PromptResult = {value: string} | null;

export interface PromptConfig {
    title: string;
    body: string; // Support <Markdown> syntax.
    warning?: string;
    inputType?: "default" | "multi-line" | "password";
    initialInputValue?: string;
    inputPlaceholder?: string;
    inputValidator?: (value: string) => string | null | Promise<string | null>;
    width?: number;
    okText?: string;
}

function createAsync(config: PromptConfig): Promise<PromptResult> {
    return new Promise<PromptResult>(resolve => {
        const ref: React.RefObject<PromptBody> = React.createRef();
        ModalUtil.createSync({
            title: config.title,
            body: <PromptBody {...config} ref={ref} />,
            okText: config.okText,
            onOk: () =>
                new Promise((closeModal, keepModal) => {
                    if (ref.current) {
                        ref.current.validateForm().then(result => {
                            if (result) {
                                closeModal();
                                resolve(result);
                            } else {
                                keepModal();
                            }
                        });
                    }
                }),
            onCancel: () => resolve(null),
            width: config.width || 550,
            autoFocusButton: null,
        });
    });
}

export const PromptUtil = Object.freeze({
    createAsync,
});
