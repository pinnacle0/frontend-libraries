import React from "react";
import {EnumSelect} from "../EnumSelect";
import type {Locale} from "../../util/LocaleUtil";
import {LocaleUtil} from "../../util/LocaleUtil";
import {ReactUtil} from "../../util/ReactUtil";

const ALL_LOCALES: Locale[] = ["zh", "en"];
const selectStyle: React.CSSProperties = {width: 120};

export const LocaleSelect = ReactUtil.memo("LocaleSelect", () => {
    const currentLocale = LocaleUtil.current();
    return (
        <EnumSelect
            list={ALL_LOCALES}
            translator={translator}
            style={selectStyle}
            value={currentLocale}
            // Do not use onChange={LocaleUtil.change}, due to "this" issue
            onChange={newLocale => LocaleUtil.change(newLocale)}
        />
    );
});

const translator = (locale: Locale): string => {
    switch (locale) {
        case "en":
            return "English";
        case "zh":
            return "中文";
    }
};
