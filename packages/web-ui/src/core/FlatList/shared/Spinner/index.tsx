import React from "react";
import {Spin} from "../../../Spin";
import "./index.less";

interface Props {
    loading: boolean;
    message?: string;
}

export const Spinner = (props: Props) => {
    const {loading, message} = props;
    return (
        <div className="g-flat-list-spinner">
            <Spin spinning={loading} size="small" />
            <div className="message">{message}</div>
        </div>
    );
};
