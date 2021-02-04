import React from "react";
import {LocalStorageUtil} from "../../util/LocalStorageUtil";
import {BoolSwitch} from "../../core/BoolSwitch";

interface Props {}

interface State {
    soundEnabled: boolean;
}

export class SoundSwitch extends React.PureComponent<Props, State> {
    static displayName = "SoundSwitch";

    private readonly soundEnabledKey = "admin-sound-enabled";

    constructor(props: Props) {
        super(props);
        this.state = {
            soundEnabled: LocalStorageUtil.getBool(this.soundEnabledKey, true),
        };
    }

    toggleSoundSwitch = () => {
        const newValue = !this.state.soundEnabled;
        this.setState({soundEnabled: newValue});
        LocalStorageUtil.setBool(this.soundEnabledKey, newValue);
    };

    render() {
        return <BoolSwitch.OnOff value={this.state.soundEnabled} onChange={this.toggleSoundSwitch} />;
    }
}
