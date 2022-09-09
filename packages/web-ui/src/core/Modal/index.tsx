import React from "react";
import AntModal from "antd/lib/modal";
import {classNames} from "../../util/ClassNames";
import {Spin} from "../Spin";
import type {ModalProps} from "antd/lib/modal";
import type {PickOptional, SafeReactChildren} from "../../internal/type";
import "antd/lib/modal/style";
import "./index.less";

export interface Props extends ModalProps {
    width: number | string; // Do not use "auto"
    children: SafeReactChildren;
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
            <AntModal title={title} className={classNames(className, {"no-padding": !addInnerPadding})} {...restProps}>
                <Spin spinning={loading || false}>{children}</Spin>
            </AntModal>
        );
    }
}
