import React from "react";
import {Spin} from "../Spin";

interface Props {
    loading: boolean;
    message?: string;
}

export const Loading = (props: Props) => {
    const {loading, message} = props;
    return (
        <div className="g-flat-list-loading">
            <div>
                <Spin spinning={loading} size="small" />
                {message ?? "Release to refresh"}
            </div>
        </div>
    );
};
