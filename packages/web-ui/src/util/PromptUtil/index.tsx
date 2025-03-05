import React from "react";
import {ModalUtil} from "../ModalUtil";
import {PromptBody} from "./PromptBody";
import {i18n} from "../../internal/i18n/util";

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
    const t = i18n();
    return new Promise<PromptResult>(resolve => {
        const ref: React.RefObject<PromptBody | null> = React.createRef();
        ModalUtil.createSync({
            title: config.title,
            body: <PromptBody {...config} ref={ref} />,
            okText: config.okText || t.defaultConfirm,
            onOk: () =>
                new Promise<void>((closeModal, keepModal) => {
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
