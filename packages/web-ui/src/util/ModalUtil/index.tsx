import React from "react";
import ReactDOM from "react-dom/client";
import Dialog from "@rc-component/dialog";
import {CloseOutlined} from "../../internal/icons";
import type {PickOptional} from "../../internal/type";
import {TextUtil} from "../../internal/TextUtil";
import {i18n} from "../../internal/i18n/util";
import "./index.less";

export interface ModalConfig {
    body: React.ReactNode;
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
    cancelButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
}

export type CreateModalReturnType = {destroy: () => void; update: (props: Partial<{title: React.ReactNode; content: React.ReactNode}>) => void};
export type ModalConfigWithoutEvent = Omit<ModalConfig, "onOk" | "onCancel">;
export type CreateAsyncModalPromise<WithCloseHandling extends boolean> = WithCloseHandling extends true ? Promise<"ok" | "cancel" | "close"> : Promise<boolean>;

export interface RootProps {
    config?: PickOptional<ModalConfig>;
}

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

    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = ReactDOM.createRoot(container);
    let currentTitle = mergedConfig.title;

    function destroy(byClose: boolean = false) {
        root.unmount();
        document.body.removeChild(container);
        if (byClose) mergedConfig.onCancel?.(true);
    }

    function renderModal(titleOverride?: React.ReactNode) {
        const title = titleOverride || currentTitle;
        root.render(
            <Dialog
                visible
                title={
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                        <span>{title}</span>
                        {mergedConfig.closable && <CloseOutlined onClick={() => destroy(true)} style={{cursor: "pointer"}} />}
                    </div>
                }
                className={`g-modal ${mergedConfig.className} ${mergedConfig.hideButtons ? "hide-modal-btns" : ""} ${mergedConfig.addInnerPadding ? "" : "no-padding"}`}
                width={mergedConfig.width}
                closable={false}
                keyboard={false}
                maskClosable={false}
                footer={
                    mergedConfig.hideButtons ? null : (
                        <div style={{display: "flex", justifyContent: "flex-end", gap: 8, padding: "10px 16px"}}>
                            {mergedConfig.footerExtra && <div style={{marginRight: "auto"}}>{mergedConfig.footerExtra}</div>}
                            {mergedConfig.cancelText && (
                                <button
                                    onClick={() => {
                                        mergedConfig.onCancel?.(false);
                                        destroy();
                                    }}
                                    style={{padding: "4px 15px", borderRadius: 6, border: "1px solid #d9d9d9", background: "#fff", cursor: "pointer"}}
                                    {...mergedConfig.cancelButtonProps}
                                >
                                    {mergedConfig.cancelText}
                                </button>
                            )}
                            <button
                                onClick={() => {
                                    mergedConfig.onOk?.();
                                    destroy();
                                }}
                                autoFocus={mergedConfig.autoFocusButton === "ok"}
                                style={{padding: "4px 15px", borderRadius: 6, border: "none", background: "#1677ff", color: "#fff", cursor: "pointer"}}
                            >
                                {mergedConfig.okText}
                            </button>
                        </div>
                    )
                }
            >
                <div className="header">{mergedConfig.subTitle}</div>
                <div className="body">{mergedConfig.body}</div>
                <div className="footer">{mergedConfig.footerExtra}</div>
            </Dialog>
        );
    }

    renderModal();

    if (mergedConfig.destroyTimeoutSecond) {
        let second = mergedConfig.destroyTimeoutSecond;
        setTimeout(() => destroy(false), second * 1000);
        setInterval(() => {
            second--;
            currentTitle = (
                <React.Fragment>
                    {mergedConfig.title} ({TextUtil.interpolate(t.autoClose, second.toString())})
                </React.Fragment>
            );
            renderModal(currentTitle);
        }, 1000);
    }

    return {
        destroy: () => destroy(false),
        update: (props: Partial<{title: React.ReactNode; content: React.ReactNode}>) => {
            if (props.title) currentTitle = props.title as any;
            renderModal(currentTitle);
        },
    };
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
        title: title || t.defaultTitle,
        body,
        width: userModalConfig.width || 480,
        okText: t.defaultConfirm,
        cancelText: t.defaultCancel,
    });
}

function Root({config}: RootProps): React.ReactElement {
    React.useEffect(() => {
        userModalConfig = config ?? {};
        return () => {
            userModalConfig = {};
        };
    }, [config]);
    return <React.Fragment />;
}

function destroyAll() {
    // No-op in new implementation since each modal manages its own lifecycle
}

export const ModalUtil = Object.freeze({
    createSync,
    createAsync,
    confirm,
    destroyAll,
    Root,
});
