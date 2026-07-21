import generatePicker from "antd/es/date-picker/generatePicker";
import baseGenerateConfig from "rc-picker/lib/generate/dayjs";
import {dayjs, TIMEZONE, type Dayjs} from "../util/DayJS";

const RE_ANCHOR_FORMAT = "YYYY-MM-DD HH:mm:ss.SSS";

function parseInTimezone(text: string, formats: string[]): Dayjs {
    for (const format of formats) {
        const parsed = dayjs.tz(text, format, TIMEZONE);
        if (parsed.isValid()) return parsed;
    }
    return dayjs.tz(text, TIMEZONE);
}

/**
 * A dayjs `generateConfig` for AntD's DatePicker/Calendar family, locked to China time (UTC+8).
 *
 * AntD's default config reads/creates dates in the machine's local timezone, so the picker UI
 * shifts with the viewer's timezone. This config forces every date the picker *creates* — "now",
 * fixed cell dates, and typed input — into China time. Operations that transform an existing
 * date (`add`, `set*`, getters) are inherited unchanged because dayjs preserves the timezone of a
 * `.tz()`-bound instance, so as long as the values handed to the picker are China-bound, the
 * whole picker stays in China time.
 *
 * Exported so `DateCalendar` (built on `generateCalendar`, not `generatePicker`) can share it.
 */
export const chinaDateConfig: typeof baseGenerateConfig = {
    ...baseGenerateConfig,
    getNow: () => dayjs().tz(TIMEZONE),
    getFixedDate: text => parseInTimezone(text, ["YYYY-M-DD", "YYYY-MM-DD"]),
    locale: {
        ...baseGenerateConfig.locale,
        parse: (locale, text, formats) => {
            // Reuse the base parser (locale-aware, handles ISO-week tokens), then re-anchor the parsed
            // wall-clock to China Standard Time instead of the machine's local timezone.
            const parsed = baseGenerateConfig.locale.parse(locale, text, formats);
            if (!parsed) return null;
            return dayjs.tz(parsed.format(RE_ANCHOR_FORMAT), RE_ANCHOR_FORMAT, TIMEZONE);
        },
    },
};

/**
 * Drop-in replacement for `antd/es/date-picker` whose entire UI (calendar, time columns, the "Now"
 * button, and typed input) is pinned to China time (UTC+8) regardless of the viewer's machine
 * timezone. Exposes the same surface as the AntD default export: `ChinaAntDatePicker`,
 * `ChinaAntDatePicker.RangePicker`, `ChinaAntDatePicker.TimePicker`, etc.
 *
 * Values still round-trip as instants/strings — callers must hand the picker China-bound dayjs
 * values (see the `core/*Picker` components) so display and input stay consistent.
 */
export const ChinaAntDatePicker: ReturnType<typeof generatePicker<Dayjs>> = generatePicker<Dayjs>(chinaDateConfig);
