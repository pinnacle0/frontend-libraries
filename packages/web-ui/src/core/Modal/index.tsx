import React from "react";
import AntModal from "antd/es/modal";
import {classNames} from "../../util/ClassNames";
import {Spin} from "../Spin";
import type {ModalProps} from "antd/es/modal";
import type {PickOptional} from "../../internal/type";
import "./index.less";

export interface Props extends ModalProps {
    width: number | string; // Do not use "auto"
    children: React.ReactNode;
    loading?: boolean;
    addInnerPadding?: boolean;
}

export class Modal extends React.PureComponent<Props> {
    static displayName = "Modal";
    static defaultProps: PickOptional<Props> = {
        centered: true,
        open: true,
        footer: null,
        maskClosable: false,
        keyboard: false,
        loading: false,
        addInnerPadding: true,
    };

    render() {
        const {children, loading, title, className, addInnerPadding, ...restProps} = this.props;
        return (
            <AntModal title={title} className={classNames("g-modal", className, {"no-padding": !addInnerPadding})} {...restProps}>
                <Spin spinning={loading || false}>{children}</Spin>
            </AntModal>
        );
    }
}
