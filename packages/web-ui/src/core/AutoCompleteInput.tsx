import type {AutoCompleteProps} from "antd/es/auto-complete";
import AntAutoComplete from "antd/es/auto-complete";
import React from "react";

export interface Props extends AutoCompleteProps {}

export class AutoCompleteInput extends React.PureComponent<Props> {
    static displayName = "AutoCompleteInput";

    static Option: typeof AntAutoComplete.Option = AntAutoComplete.Option;

    render() {
        return <AntAutoComplete {...this.props} />;
    }
}
