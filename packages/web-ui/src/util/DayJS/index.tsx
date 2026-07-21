import dayjs, {type Dayjs} from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localeData from "dayjs/plugin/localeData";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekYear from "dayjs/plugin/weekYear";

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * The date/time pickers always present values in Beijing time (China Standard Time, UTC+8),
 * regardless of the machine's local timezone. Setting it as the dayjs default timezone makes
 * `dayjs.tz(...)` / `.tz()` resolve to Beijing unless another zone is passed explicitly.
 */
export const TIMEZONE = "Asia/Shanghai";
dayjs.tz.setDefault(TIMEZONE);

export {dayjs, Dayjs};
