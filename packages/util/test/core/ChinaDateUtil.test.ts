import {ChinaDateUtil} from "../../src/core/ChinaDateUtil.js";
import {describe, test, expect, beforeAll, afterAll} from "vitest";

/**
 * ChinaDateUtil is pinned to Beijing time (UTC+8), so these expectations are built independently of
 * the machine's local timezone. The suite forces a non-Beijing timezone to prove that the results
 * do not depend on the machine.
 */
const BEIJING_OFFSET_MS = 8 * 60 * 60 * 1000;
const beijingDayStart = (year: number, month: number, day: number): Date => new Date(Date.UTC(year, month, day, 0, 0, 0, 0) - BEIJING_OFFSET_MS);
const beijingDayEnd = (year: number, month: number, day: number): Date => new Date(Date.UTC(year, month, day, 23, 59, 59, 999) - BEIJING_OFFSET_MS);
const beijingInstant = (year: number, month: number, day: number, hours = 0, minutes = 0, seconds = 0, milliseconds = 0): Date =>
    new Date(Date.UTC(year, month, day, hours, minutes, seconds, milliseconds) - BEIJING_OFFSET_MS);
const todayBeijing = (): {year: number; month: number; day: number} => {
    const shifted = new Date(Date.now() + BEIJING_OFFSET_MS);
    return {year: shifted.getUTCFullYear(), month: shifted.getUTCMonth(), day: shifted.getUTCDate()};
};

const originalTZ = process.env.TZ;
beforeAll(() => {
    // Node re-reads process.env.TZ at runtime; forcing a non-Beijing zone proves timezone-independence.
    process.env.TZ = "America/New_York";
});
afterAll(() => {
    process.env.TZ = originalTZ;
});

describe("ChinaDateUtil (machine timezone is not Beijing)", () => {
    test("machine really is not in Beijing time for this run", () => {
        expect(new Date().getTimezoneOffset()).not.toBe(-480);
    });

    describe("daysBeforeToday", () => {
        test("returns correct date", () => {
            const {year, month, day} = todayBeijing();
            expect(ChinaDateUtil.daysBeforeToday(10, "day-start")).toStrictEqual(beijingDayStart(year, month, day - 10));
            expect(ChinaDateUtil.daysBeforeToday(10, "day-end")).toStrictEqual(beijingDayEnd(year, month, day - 10));
        });

        test("throws error on negative `days` argument", () => {
            expect(() => ChinaDateUtil.daysBeforeToday(-10, "day-start")).toThrow();
        });
    });

    describe("daysAfterToday", () => {
        test("returns correct date", () => {
            const {year, month, day} = todayBeijing();
            expect(ChinaDateUtil.daysAfterToday(10, "day-end")).toStrictEqual(beijingDayEnd(year, month, day + 10));
            expect(ChinaDateUtil.daysAfterToday(10, "day-start")).toStrictEqual(beijingDayStart(year, month, day + 10));
        });

        test("throws error on negative `days` argument", () => {
            expect(() => ChinaDateUtil.daysAfterToday(-10, "day-start")).toThrow();
        });
    });

    describe("today / todayAsString", () => {
        test("returns correct date", () => {
            const {year, month, day} = todayBeijing();
            expect(ChinaDateUtil.today("day-end")).toStrictEqual(beijingDayEnd(year, month, day));
            expect(ChinaDateUtil.today("day-start")).toStrictEqual(beijingDayStart(year, month, day));
        });

        test("todayAsString matches the Beijing calendar day", () => {
            const {year, month, day} = todayBeijing();
            const expected = `${year}-${(month + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
            expect(ChinaDateUtil.todayAsString()).toBe(expected);
        });
    });
    describe("daysBeforeTodayAsString / daysAfterTodayAsString", () => {
        test("returns Beijing calendar-day strings", () => {
            const {year, month, day} = todayBeijing();
            const fmt = (y: number, m0: number, d: number) => ChinaDateUtil.format(beijingDayStart(y, m0, d));
            expect(ChinaDateUtil.daysBeforeTodayAsString(3)).toBe(fmt(year, month, day - 3));
            expect(ChinaDateUtil.daysAfterTodayAsString(3)).toBe(fmt(year, month, day + 3));
        });
    });

    describe("format", () => {
        test('returns "-" on null', () => {
            expect(ChinaDateUtil.format(null)).toBe("-");
            expect(ChinaDateUtil.format(null, "with-time")).toBe("-");
        });

        test("returns correctly formatted Beijing date string", () => {
            const date1 = beijingInstant(2018, 1, 12, 12, 12, 12); // 2018-02-12 12:12:12 Beijing
            expect(ChinaDateUtil.format(date1)).toBe("2018-02-12");
            expect(ChinaDateUtil.format(date1, "with-time")).toBe("2018-02-12 12:12:12");
            expect(ChinaDateUtil.format(date1, "no-year")).toBe("02/12");
            expect(ChinaDateUtil.format(date1, "no-year-with-time")).toBe("02/12 12:12:12");
            expect(ChinaDateUtil.format(date1, "no-day")).toBe("2018-02");
            expect(ChinaDateUtil.format(date1, "chinese")).toBe("2018年02月12日");
            expect(ChinaDateUtil.format(date1, "chinese-with-time")).toBe("2018年02月12日 12:12:12");
            expect(ChinaDateUtil.format(date1, "time")).toBe("12:12:12");
        });
    });
});
