import React from "react";
import Modal, {ModalFuncProps} from "antd/lib/modal";
import {ModalFunc} from "antd/lib/modal/confirm";
import "antd/lib/modal/style";
import CloseOutlined from "@ant-design/icons/CloseOutlined";
import {PickOptional, SafeReactChild, SafeReactChildren} from "../../internal/type";
import {StringUtil} from "../../internal/StringUtil";
import {i18n} from "../../internal/i18n/util";
import "./index.less";

export type CreateModalReturnType = ReturnType<ModalFunc>;

export type ModalConfigWithoutEvent = Omit<ModalConfig, "onOk" | "onCancel">;

export interface ModalConfig {
    body: SafeReactChildren; // Use array for multiple rows
    title?: React.ReactChild;
    closable?: boolean;
    width?: number;
    className?: string;
    okText?: string;
    cancelText?: string;
    subTitle?: string;
    onOk?: () => any;
    onCancel?: (byClose: boolean) => any;
    destroyTimeoutSecond?: number;
    autoFocusButton?: "ok" | "cancel" | null;
    hideButtons?: boolean;
    addInnerPadding?: boolean;
    // TODO/James: complete this logic, for 單挑 UI
    footerExtra?: SafeReactChild;
}

function createSync(config: ModalConfig): CreateModalReturnType {
    const t = i18n();
    const defaultModalConfig: PickOptional<ModalConfig> = {
        title: t.defaultTitle,
        closable: true,
        width: 550,
        className: "",
        okText: t.defaultOk,
        autoFocusButton: "ok",
        addInnerPadding: true,
    };
    const mergedConfig = {...defaultModalConfig, ...config};
    if (Array.isArray(mergedConfig.body)) {
        mergedConfig.body = mergedConfig.body.map((rowContent, index) => <p key={index}>{rowContent}</p>);
    }

    const getTitle = (remainingSecond?: number) => {
        const titleNode: SafeReactChildren = [mergedConfig.title!];
        if (remainingSecond) {
            titleNode.push(` (${StringUtil.interpolate(t.autoClose, remainingSecond.toString())})`);
        }

        return mergedConfig.closable ? (
            <React.Fragment>
                <span>{titleNode}</span>
                <CloseOutlined onClick={() => destroy(true)} />
            </React.Fragment>
        ) : (
            titleNode
        );
    };

    const antModalConfig: ModalFuncProps = {
        title: getTitle(mergedConfig.destroyTimeoutSecond),
        content: (
            <React.Fragment>
                <div className="header">{mergedConfig.subTitle}</div>
                <div className="body">{mergedConfig.body}</div>
                <div className="footer">{mergedConfig.footerExtra}</div>
            </React.Fragment>
        ),
        width: mergedConfig.width,
        className: `${mergedConfig.className} ${mergedConfig.hideButtons ? "hide-modal-btns" : ""} ${mergedConfig.addInnerPadding ? "" : "no-padding"}`,
        okText: mergedConfig.okText,
        cancelText: mergedConfig.cancelText,
        onOk: mergedConfig.onOk,
        onCancel: () => mergedConfig.onCancel?.(false),
        centered: true,
        keyboard: false,
        autoFocusButton: mergedConfig.autoFocusButton,
        icon: null,
    };

    const ref = mergedConfig.cancelText ? Modal.confirm(antModalConfig) : Modal.info(antModalConfig);

    function destroy(byClose: boolean) {
        ref.destroy();
        mergedConfig.onCancel?.(byClose);
    }

    if (mergedConfig.destroyTimeoutSecond) {
        let second = mergedConfig.destroyTimeoutSecond;
        setTimeout(() => destroy(false), second * 1000);
        setInterval(() => ref.update({title: getTitle(--second)}), 1000);
    }

    const enhancedRef = {...ref, destroy: () => destroy(false)};

    return enhancedRef;
}

function createAsync(config: ModalConfigWithoutEvent): Promise<boolean> {
    return new Promise<boolean>(resolve => {
        createSync({
            ...config,
            onOk: () => resolve(true),
            onCancel: () => resolve(false),
        });
    });
}

function confirm(body: SafeReactChildren, title?: string): Promise<boolean> {
    const t = i18n();
    return createAsync({
        /**
         * Do not simply pass title down.
         * Because Object.assign (or spread operator) will keep undefined value, instead of default merging.
         */
        title: title || t.defaultTitle,
        body,
        width: 480,
        okText: t.defaultOk,
        cancelText: t.defaultCancel,
    });
}

function destroyAll() {
    Modal.destroyAll();
}

export const ModalUtil = Object.freeze({
    createSync,
    createAsync,
    confirm,
    destroyAll,
});
