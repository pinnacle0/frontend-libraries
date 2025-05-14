import React from "react";
import {EnumSelect} from "../EnumSelect";
import type {Locale} from "../../util/LocaleUtil";
import {LocaleUtil} from "../../util/LocaleUtil";

export interface Props {}

export class LocaleSelect extends React.PureComponent<Props> {
    static displayName = "LocaleSelect";

    private readonly allLocales: Locale[] = ["zh", "en"];
    private readonly selectStyle: React.CSSProperties = {width: 120};

    translator = (locale: Locale): string => {
        switch (locale) {
            case "en":
                return "English";
            case "zh":
                return "中文";
        }
    };

    render() {
        const currentLocale = LocaleUtil.current();
        return (
            <EnumSelect
                list={this.allLocales}
                translator={this.translator}
                style={this.selectStyle}
                value={currentLocale}
                // Do not use onChange={LocaleUtil.change}, due to "this" issue
                onChange={newLocale => LocaleUtil.change(newLocale)}
            />
        );
    }
}
