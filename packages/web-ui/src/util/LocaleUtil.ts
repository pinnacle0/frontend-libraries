import React from "react";
import {LocalStorageUtil} from "./LocalStorageUtil";

/**
 * Only "zh" (Simplified Chinese) / "en" (English) are supported now.
 * CAVEAT:
 *
 * We do not store Locale into application context (or store).
 * So that we can access locale info anywhere in the code, as well as performance.
 *
 * Page refresh is required if you want to switch language.
 */
export type Locale = "zh" | "en";

export const LocaleContext = React.createContext<Locale>("en");

class LocaleManager {
    private readonly storageKey = "ui-pref-locale";
    private locale: Locale = "en";

    setInitial(locale: Locale | "auto"): void {
        this.locale = locale === "auto" ? this.preferredLocale() : locale;
    }

    change(locale: Locale): void {
        LocalStorageUtil.setString(this.storageKey, locale);
        location.reload();
    }

    current(): Locale {
        return this.locale;
    }

    private preferredLocale(): Locale {
        let navigatorLocale: Locale;
        const navigatorLanguage = navigator.languages ? navigator.languages[0] : navigator.language;
        if (navigatorLanguage.startsWith("zh")) {
            // "zh-TW", "zh-CN", "zh-HK", "zh-SG"
            navigatorLocale = "zh";
        } else {
            navigatorLocale = "en";
        }
        return LocalStorageUtil.getString<Locale>(this.storageKey, navigatorLocale, ["zh", "en"]);
    }
}

export const LocaleUtil = new LocaleManager();
