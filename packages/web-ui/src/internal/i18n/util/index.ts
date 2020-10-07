import en from "./en";
import zh from "./zh";
import {Locale, LocaleUtil} from "../../../util/LocaleUtil";

const i18nMap: Record<Locale, typeof en> = {
    en,
    zh,
};

export function i18n() {
    return i18nMap[LocaleUtil.current()];
}
