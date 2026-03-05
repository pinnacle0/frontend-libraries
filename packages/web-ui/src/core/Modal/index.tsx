import React from "react";
import Dialog from "@rc-component/dialog";
import {classNames} from "../../util/ClassNames";
import {Spin} from "../Spin";
import {CloseOutlined} from "../../internal/icons";
import {ReactUtil} from "../../util/ReactUtil";
import "./index.less";

export interface Props {
    open?: boolean;
    title?: React.ReactNode;
    width: number | string;
    children: React.ReactNode;
    loading?: boolean;
    addInnerPadding?: boolean;
    footer?: React.ReactNode;
    closable?: boolean;
    maskClosable?: boolean;
    keyboard?: boolean;
    onCancel?: (e: React.SyntheticEvent) => void;
    afterClose?: () => void;
    destroyOnClose?: boolean;
    className?: string;
    style?: React.CSSProperties;
    wrapClassName?: string;
    zIndex?: number;
    mask?: boolean;
    getContainer?: string | HTMLElement | (() => HTMLElement) | false;
}

export const Modal = ReactUtil.memo("Modal", (props: Props) => {
    const {open = true, footer = null, maskClosable = false, keyboard = false, children, loading = false, title, className, addInnerPadding = true, closable = true, onCancel, ...restProps} = props;
    return (
        <Dialog
            visible={open}
            title={title}
            className={classNames("g-modal", className, {"no-padding": !addInnerPadding, "no-footer": footer === null})}
            footer={footer}
            onClose={onCancel as any}
            maskClosable={maskClosable}
            keyboard={keyboard}
            closable={closable}
            closeIcon={<CloseOutlined />}
            {...restProps}
        >
            <Spin spinning={loading || false}>{children}</Spin>
        </Dialog>
    );
});
