import AntModal, {ModalProps} from "antd/lib/modal";
import "antd/lib/modal/style";
import React from "react";
import {Spin} from "../Spin";
import {PickOptional} from "../../internal/type";
import "./index.less";

export interface Props extends ModalProps {
    width: number | string; // Do not use "auto"
    appendToBody?: boolean;
    loading?: boolean;
    extraTitle?: string;
    addInnerPadding?: boolean;
}

export class Modal extends React.PureComponent<Props> {
    static displayName = "Modal";
    static defaultProps: PickOptional<Props> = {
        appendToBody: false,
        centered: true,
        visible: true,
        footer: null,
        maskClosable: false,
        keyboard: false,
        loading: false,
        addInnerPadding: true,
    };

    private readonly containerRef: React.RefObject<HTMLDivElement>;
    private readonly extraTitleStyle: React.CSSProperties = {fontSize: 13, fontWeight: "lighter", marginLeft: 15};

    constructor(props: Props) {
        super(props);
        this.containerRef = React.createRef();
    }

    // Benefits:
    //  (1) support global-loading laying above the modal
    //  (2) support nested CSS
    getModalContainer = () => (this.props.appendToBody ? document.body : this.containerRef.current!);

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
            <React.Fragment>
                <div ref={this.containerRef} />
                <AntModal
                    getContainer={this.getModalContainer}
                    title={extraTitle ? this.renderTitleWithExtraInfo() : title}
                    className={`${className || ""} ${!addInnerPadding ? "ant-modal-no-padding" : ""}`}
                    {...restProps}
                >
                    <Spin spinning={loading || false}>{children}</Spin>
                </AntModal>
            </React.Fragment>
        );
    }
}
