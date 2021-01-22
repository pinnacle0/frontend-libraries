import React from "react";
import type {ModalProps} from "antd/lib/modal";
import AntModal from "antd/lib/modal";
import {Spin} from "../Spin";
import type {PickOptional, SafeReactChildren} from "../../internal/type";

import "antd/lib/modal/style";
import "./index.less";

export interface Props extends ModalProps {
    width: number | string; // Do not use "auto"
    loading?: boolean;
    addInnerPadding?: boolean;
    children: SafeReactChildren;
}

export class Modal extends React.PureComponent<Props> {
    static displayName = "Modal";
    static defaultProps: PickOptional<Props> = {
        centered: true,
        visible: true,
        footer: null,
        maskClosable: false,
        keyboard: false,
        loading: false,
        addInnerPadding: true,
    };

    render() {
        const {children, loading, title, className, addInnerPadding, ...restProps} = this.props;
        return (
            <AntModal title={title} className={`${className || ""} ${addInnerPadding ? "" : "no-padding"}`} {...restProps}>
                <Spin spinning={loading || false}>{children}</Spin>
            </AntModal>
        );
    }
}
