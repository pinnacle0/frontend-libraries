import React from "react";
import AntModal, {ModalProps} from "antd/lib/modal";
import {Spin} from "../Spin";
import {PickOptional} from "../../internal/type";
import "antd/lib/modal/style";
import "./index.less";

export interface Props extends ModalProps {
    width: number | string; // Do not use "auto"
    loading?: boolean;
    extraTitle?: string;
    addInnerPadding?: boolean;
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

    private readonly extraTitleStyle: React.CSSProperties = {fontSize: 13, fontWeight: "lighter", marginLeft: 15};

    constructor(props: Props) {
        super(props);
    }

    renderTitleWithExtraInfo = () => {
        const {title, extraTitle} = this.props;
        return (
            <React.Fragment>
                {title}
                <span style={this.extraTitleStyle}>{extraTitle}</span>
            </React.Fragment>
        );
    };

    render() {
        const {children, loading, title, extraTitle, className, addInnerPadding, ...restProps} = this.props;
        return (
            <AntModal title={extraTitle ? this.renderTitleWithExtraInfo() : title} className={`${className || ""} ${addInnerPadding ? "" : "no-padding"}`} {...restProps}>
                <Spin spinning={loading || false}>{children}</Spin>
            </AntModal>
        );
    }
}
