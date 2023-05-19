import React from "react";
import type {ModalFuncProps} from "antd/es/modal";
import Modal from "antd/es/modal";
import type {ModalFunc, ModalStaticFunctions} from "antd/es/modal/confirm";
import CloseOutlined from "@ant-design/icons/CloseOutlined";
import type {PickOptional} from "../../internal/type";
import {TextUtil} from "../../internal/TextUtil";
import {i18n} from "../../internal/i18n/util";
import "./index.less";
import type {ButtonProps} from "antd/es/button";

export type CreateModalReturnType = ReturnType<ModalFunc>;

export type ModalConfigWithoutEvent = Omit<ModalConfig, "onOk" | "onCancel">;

export type CreateAsyncModalPromise<WithCloseHandling extends boolean> = WithCloseHandling extends true ? Promise<"ok" | "cancel" | "close"> : Promise<boolean>;

export interface ModalConfig {
    body: React.ReactNode; // Use array for multiple rows
    title?: React.ReactElement | string;
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
    footerExtra?: React.ReactElement | string | number;
    cancelButtonProps?: ButtonProps;
}

export interface RootProps {
    config?: PickOptional<ModalConfig>;
}

let modalInstance: Omit<ModalStaticFunctions, "warn"> | null = null;

let userModalConfig: PickOptional<ModalConfig> = {};

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
    const mergedConfig: ModalConfig = {...defaultModalConfig, ...userModalConfig, ...config};
    if (Array.isArray(mergedConfig.body)) {
        mergedConfig.body = mergedConfig.body.map((rowContent, index) => <div key={index}>{rowContent}</div>);
    }

    const getTitle = (remainingSecond?: number) => {
        const titleNode: Array<React.ReactElement | string> = [mergedConfig.title!];
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
        className: `g-modal ${mergedConfig.className} ${mergedConfig.hideButtons ? "hide-modal-btns" : ""} ${mergedConfig.addInnerPadding ? "" : "no-padding"}`,
        okText: mergedConfig.okText,
        cancelText: mergedConfig.cancelText,
        onOk: mergedConfig.onOk,
        onCancel: () => mergedConfig.onCancel?.(false),
        centered: true,
        keyboard: false,
        autoFocusButton: mergedConfig.autoFocusButton,
        icon: null,
        cancelButtonProps: mergedConfig.cancelButtonProps,
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

function createAsync<WithCloseHandling extends boolean = false>(
    config: ModalConfigWithoutEvent,
    withCloseHandling: WithCloseHandling = false as WithCloseHandling
): CreateAsyncModalPromise<WithCloseHandling> {
    if (withCloseHandling) {
        return new Promise<"ok" | "cancel" | "close">(resolve => {
            createSync({
                ...config,
                onOk: () => resolve("ok"),
                onCancel: byClose => resolve(byClose ? "close" : "cancel"),
            });
        }) as CreateAsyncModalPromise<WithCloseHandling>;
    }

    return new Promise<boolean>(resolve => {
        createSync({
            ...config,
            onOk: () => resolve(true),
            onCancel: () => resolve(false),
        });
    }) as CreateAsyncModalPromise<WithCloseHandling>;
}

function confirm(body: React.ReactNode, title?: string): Promise<boolean> {
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

function Root({config}: RootProps): React.ReactElement {
    const [apiInstance, contextHolder] = Modal.useModal();
    React.useEffect(
        () => {
            if (modalInstance) {
                throw new Error("[web-ui] ModalUtil.Root cannot be mounted more than once");
            }
            modalInstance = apiInstance;
            userModalConfig = config ?? {};
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
