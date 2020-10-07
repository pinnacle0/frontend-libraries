import React from "react";
import AntRadio, {RadioChangeEvent, RadioProps} from "antd/lib/radio";
import "antd/lib/radio/style";

export interface Props extends RadioProps {}

export class Radio extends React.PureComponent<Props> {
    static displayName = "Radio";

    static Button = AntRadio.Button;

    static Group = AntRadio.Group;

    render() {
        return <AntRadio {...this.props} />;
    }
}

export {RadioChangeEvent};
