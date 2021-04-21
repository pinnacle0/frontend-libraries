import React from "react";
import type {ModalFuncProps} from "antd/lib/modal";
import Modal from "antd/lib/modal";
import type {ModalFunc, ModalStaticFunctions} from "antd/lib/modal/confirm";
import "antd/lib/modal/style";
import CloseOutlined from "@ant-design/icons/CloseOutlined";
import type {PickOptional, SafeReactChild, SafeReactChildren} from "../../internal/type";
import {TextUtil} from "../../internal/TextUtil";
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
    footerExtra?: SafeReactChild;
}

let modalInstance: Omit<ModalStaticFunctions, "warn"> | null = null;

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
    const mergedConfig: ModalConfig = {...defaultModalConfig, ...config};
    if (Array.isArray(mergedConfig.body)) {
        mergedConfig.body = mergedConfig.body.map((rowContent, index) => <p key={index}>{rowContent}</p>);
    }

    const getTitle = (remainingSecond?: number) => {
        const titleNode: SafeReactChildren = [mergedConfig.title!];
        if (remainingSecond) {
            titleNode.push(` (${TextUtil.interpolate(t.autoClose, remainingSecond.toString())})`);
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

    const instance = modalInstance || Modal;
    const ref = mergedConfig.cancelText ? instance.confirm(antModalConfig) : instance.info(antModalConfig);

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
        okText: t.defaultConfirm,
        cancelText: t.defaultCancel,
    });
}

function Root(): React.ReactElement {
    const [apiInstance, contextHolder] = Modal.useModal();
    React.useEffect(
        () => {
            if (modalInstance) {
                throw new Error("[web-ui] ModalUtil.Root cannot be mounted more than once");
            }
            modalInstance = apiInstance;
            return () => {
                modalInstance = null;
            };
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps -- for didMount/willUnmount lifecycle
        []
    );
    return contextHolder;
}

/**
 * If using <ModalUtil.Root />, this function will not work
 */
function destroyAll() {
    Modal.destroyAll();
}

export const ModalUtil = Object.freeze({
    createSync,
    createAsync,
    confirm,
    destroyAll,
    Root,
});
