import {DateUtil} from "../../src/core/DateUtil";
import {describe, test, expect} from "vitest";

describe("DateUtil.daysBeforeToday", () => {
    test("returns correct date", () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const day = today.getDate();

        expect(DateUtil.daysBeforeToday(10, "day-start")).toStrictEqual(new Date(year, month, day - 10, 0, 0, 0));
        expect(DateUtil.daysBeforeToday(10, "day-end")).toStrictEqual(new Date(year, month, day - 10, 23, 59, 59, 999));
    });

    test("throws error on negative `days` argument", () => {
        expect(() => DateUtil.daysBeforeToday(-10, "day-start")).toThrow();
        expect(() => DateUtil.daysBeforeToday(-10, "day-end")).toThrow();
    });
});

describe("DateUtil.daysAfterToday", () => {
    test("returns correct date", () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const day = today.getDate();
        expect(DateUtil.daysAfterToday(10, "day-end")).toStrictEqual(new Date(year, month, day + 10, 23, 59, 59, 999));
        expect(DateUtil.daysAfterToday(10, "day-start")).toStrictEqual(new Date(year, month, day + 10, 0, 0, 0));
    });

    test("throws error on negative `days` argument", () => {
        expect(() => DateUtil.daysAfterToday(-10, "day-start")).toThrow();
        expect(() => DateUtil.daysAfterToday(-10, "day-end")).toThrow();
    });
});

describe("DateUtil.today", () => {
    test("returns correct date", () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const day = today.getDate();
        expect(DateUtil.today("day-end")).toStrictEqual(new Date(year, month, day, 23, 59, 59, 999));
        expect(DateUtil.today("day-start")).toStrictEqual(new Date(year, month, day, 0, 0, 0));
    });
});

describe("DateUtil.daysBefore", () => {
    const date = new Date("2010-10-01");

    test("returns correct date", () => {
        expect(DateUtil.daysBefore(date, 2, "day-end")).toStrictEqual(new Date("2010-09-29 23:59:59.999"));
        expect(DateUtil.daysBefore(date, 2, "day-start")).toStrictEqual(new Date("2010-09-29 00:00:00"));
    });

    test("throws error on negative `days` argument", () => {
        expect(() => DateUtil.daysBefore(date, -2, "day-start")).toThrow();
        expect(() => DateUtil.daysBefore(date, -2, "day-end")).toThrow();
    });
});

describe("DateUtil.daysAfter", () => {
    const date = new Date("2010-10-01");

    test("returns correct date", () => {
        expect(DateUtil.daysAfter(date, 10, "day-end")).toStrictEqual(new Date("2010-10-11 23:59:59.999"));
        expect(DateUtil.daysAfter(date, 10, "day-start")).toStrictEqual(new Date("2010-10-11 00:00:00"));
    });

    test("throws error on negative `days` argument", () => {
        expect(() => DateUtil.daysAfter(date, -10, "day-start")).toThrow();
        expect(() => DateUtil.daysAfter(date, -10, "day-end")).toThrow();
    });
});

describe("DateUtil.someday", () => {
    test("returns correct date (parse date string)", () => {
        const date1 = new Date("2010-10-03 12:32:22");
        expect(DateUtil.someday(date1, "day-end")).toStrictEqual(new Date("2010-10-03 23:59:59.999"));
        expect(DateUtil.someday(date1, "day-start")).toStrictEqual(new Date("2010-10-03 00:00:00"));
    });

    test("returns correct date (parse unix timestamp)", () => {
        // Wed Jul 17 2019 15:32:00 GMT+0800
        const date2 = new Date(1563348720799);
        expect(DateUtil.someday(date2, "day-end")).toStrictEqual(new Date("2019-07-17 23:59:59.999"));
        expect(DateUtil.someday(date2, "day-start")).toStrictEqual(new Date("2019-07-17 00:00:00"));
    });
});

describe("DateUtil.parse", () => {
    test("returns null on invalid date", () => {
        expect(DateUtil.parse("")).toBeNull();
        expect(DateUtil.parse("abc")).toBeNull();
    });

    test("returns correct date", () => {
        const timezoneOffsetMinutes = new Date().getTimezoneOffset();
        {
            const resultDate = DateUtil.parse("2018-12-11");
            const expectedDateParam = "2018-12-11";
            expect(resultDate).toStrictEqual(new Date(expectedDateParam));
        }
        {
            const resultDate = DateUtil.parse("2018-1-6");
            const expectedDateUTCMilliseconds = Date.UTC(2018, 0, 6, 0, 0, 0, 0); // Note: month is 0-based
            const expectedDateParam = expectedDateUTCMilliseconds + timezoneOffsetMinutes * 60 * 1000;
            expect(resultDate).toStrictEqual(new Date(expectedDateParam));
        }
        {
            const resultDate = DateUtil.parse("2018/12/11");
            const expectedDateUTCMilliseconds = Date.UTC(2018, 11, 11, 0, 0, 0); // Note: month is 0-based
            const expectedDateParam = expectedDateUTCMilliseconds + timezoneOffsetMinutes * 60 * 1000;
            expect(resultDate).toStrictEqual(new Date(expectedDateParam));
        }
    });
});

describe("DateUtil.format", () => {
    test('returns "-" on null `date` argument', () => {
        expect(DateUtil.format(null)).toBe("-");
        expect(DateUtil.format(null, "with-time")).toBe("-");
        expect(DateUtil.format(null, "no-year")).toBe("-");
        expect(DateUtil.format(null, "no-year-with-time")).toBe("-");
    });

    test("returns correctly formatted date string", () => {
        const date1 = new Date("2018-02-12 12:12:12");
        expect(DateUtil.format(date1)).toBe("2018-02-12");
        expect(DateUtil.format(date1, "with-time")).toBe("2018-02-12 12:12:12");
        expect(DateUtil.format(date1, "no-year")).toBe("02/12");
        expect(DateUtil.format(date1, "no-year-with-time")).toBe("02/12 12:12:12");
        expect(DateUtil.format(date1, "no-day")).toBe("2018-02");
        expect(DateUtil.format(date1, "chinese")).toBe("2018年02月12日");

        const date2 = new Date("2018-2-2 1:1:1");
        expect(DateUtil.format(date2)).toBe("2018-02-02");
        expect(DateUtil.format(date2, "with-time")).toBe("2018-02-02 01:01:01");
        expect(DateUtil.format(date2, "no-year")).toBe("02/02");
        expect(DateUtil.format(date2, "no-year-with-time")).toBe("02/02 01:01:01");
        expect(DateUtil.format(date2, "chinese-with-time")).toBe("2018年02月02日 01:01:01");
    });
});

describe("DateUtil.dayDiff", () => {
    test("throw error if invalid string", () => {
        expect(() => DateUtil.dayDiff("-", "2020-01-01")).toThrow();
        expect(() => DateUtil.dayDiff("2020-01-01", "--")).toThrow();
        expect(() => DateUtil.dayDiff("-", "abc")).toThrow();
        expect(() => DateUtil.dayDiff("", "")).toThrow();
    });

    test("test string format", () => {
        const d1 = "2020-01-01";
        const d2 = "2020-01-08";
        const d3 = "2019-12-31";
        const d4 = "2019-12-02";
        const d5 = "2019-11-30";

        expect(DateUtil.dayDiff(d1, d2)).toBe(-7);
        expect(DateUtil.dayDiff(d2, d1)).toBe(7);
        expect(DateUtil.dayDiff(d2, d2)).toBe(0);
        expect(DateUtil.dayDiff(d1, d3)).toBe(1);
        expect(DateUtil.dayDiff(d2, d3)).toBe(8);
        expect(DateUtil.dayDiff(d3, d2)).toBe(-8);
        expect(DateUtil.dayDiff(d1, d4)).toBe(30);
        expect(DateUtil.dayDiff(d1, d5)).toBe(32);
    });

    test("test Date format", () => {
        const d1 = new Date("2020-01-01");
        const d2 = new Date("2020-01-08 23:59:11");
        const d3 = new Date("2019-12-31 00:00:00");
        const d4 = new Date("2019-12-02 12:00:00");
        const d5 = new Date("2019-11-30 08:05");

        expect(DateUtil.dayDiff(d1, d2)).toBe(-7);
        expect(DateUtil.dayDiff(d2, d1)).toBe(7);
        expect(DateUtil.dayDiff(d2, d2)).toBe(0);
        expect(DateUtil.dayDiff(d1, d3)).toBe(1);
        expect(DateUtil.dayDiff(d2, d3)).toBe(8);
        expect(DateUtil.dayDiff(d3, d2)).toBe(-8);
        expect(DateUtil.dayDiff(d1, d4)).toBe(30);
        expect(DateUtil.dayDiff(d1, d5)).toBe(32);
    });
});
