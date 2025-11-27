import type {AutoCompleteProps} from "antd/es/auto-complete";
import AntAutoComplete from "antd/es/auto-complete";
import React from "react";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props extends AutoCompleteProps {}

export const AutoCompleteInputOption: typeof AntAutoComplete.Option = AntAutoComplete.Option;

export const AutoCompleteInput = ReactUtil.memo("AutoCompleteInput", (props: Props) => {
    return <AntAutoComplete {...props} />;
});
