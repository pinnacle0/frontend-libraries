import React from "react";
import AntModal from "antd/es/modal";
import {classNames} from "../../util/ClassNames";
import {Spin} from "../Spin";
import type {ModalProps} from "antd/es/modal";
import "./index.less";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props extends ModalProps {
    width: number | string; // Do not use "auto"
    children: React.ReactNode;
    loading?: boolean;
    addInnerPadding?: boolean;
}

export const Modal = ReactUtil.memo("Modal", (props: Props) => {
    const {centered = true, open = true, footer = null, maskClosable = false, keyboard = false, children, loading = false, title, className, addInnerPadding = true, ...restProps} = props;
    return (
        // footer === undefined will render default buttons from antd, but in our case, it will never be undefined as the default is null
        <AntModal
            title={title}
            className={classNames("g-modal", className, {"no-padding": !addInnerPadding, "no-footer": footer === null})}
            footer={footer}
            centered={centered}
            open={open}
            maskClosable={maskClosable}
            keyboard={keyboard}
            {...restProps}
        >
            <Spin spinning={loading || false}>{children}</Spin>
        </AntModal>
    );
});
