import React from "react";
import {Spin} from "../../../Spin";
import {Spinner} from "../Spinner";

interface Props {
    loading: boolean;
    message?: string;
}

export const Loading = (props: Props) => {
    const {loading, message} = props;

    return (
        <div className="g-flat-list-loading">
            <Spinner loading={loading} message={message ?? "Release to refresh"} />
        </div>
    );
};
