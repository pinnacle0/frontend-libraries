import type {AutoCompleteProps} from "antd/lib/auto-complete";
import AntAutoComplete from "antd/lib/auto-complete";
import "antd/lib/auto-complete/style";
import React from "react";

export interface Props extends AutoCompleteProps {}

export class AutoCompleteInput extends React.PureComponent<Props> {
    static displayName = "AutoCompleteInput";

    static Option = AntAutoComplete.Option;

    render() {
        return <AntAutoComplete {...this.props} />;
    }
}
