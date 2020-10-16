import {DateUtil} from "../../src/core/DateUtil";

describe("DateUtil.daysBeforeToday", () => {
    test("returns correct date", () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const day = today.getDate();

        expect(DateUtil.daysBeforeToday(10, "day-start")).toStrictEqual(new Date(year, month, day - 10, 0, 0, 0));
        expect(DateUtil.daysBeforeToday(10, "day-end")).toStrictEqual(new Date(year, month, day - 10, 23, 59, 59));
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
        expect(DateUtil.daysAfterToday(10, "day-end")).toStrictEqual(new Date(year, month, day + 10, 23, 59, 59));
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
        expect(DateUtil.today("day-end")).toStrictEqual(new Date(year, month, day, 23, 59, 59));
        expect(DateUtil.today("day-start")).toStrictEqual(new Date(year, month, day, 0, 0, 0));
    });
});

describe("DateUtil.daysBefore", () => {
    const date = new Date("2010-10-01");

    test("returns correct date", () => {
        expect(DateUtil.daysBefore(date, 2, "day-end")).toStrictEqual(new Date("2010-09-29 23:59:59"));
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
        expect(DateUtil.daysAfter(date, 10, "day-end")).toStrictEqual(new Date("2010-10-11 23:59:59"));
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
        expect(DateUtil.someday(date1, "day-end")).toStrictEqual(new Date("2010-10-03 23:59:59"));
        expect(DateUtil.someday(date1, "day-start")).toStrictEqual(new Date("2010-10-03 00:00:00"));
    });

    test("returns correct date (parse unix timestamp)", () => {
        // Wed Jul 17 2019 15:32:00 GMT+0800
        const date2 = new Date(1563348720799);
        expect(DateUtil.someday(date2, "day-end")).toStrictEqual(new Date("2019-07-17 23:59:59"));
        expect(DateUtil.someday(date2, "day-start")).toStrictEqual(new Date("2019-07-17 00:00:00"));
    });
});

describe("DateUtil.parse", () => {
    test("returns null on invalid date", () => {
        expect(DateUtil.parse("")).toBeNull();
        expect(DateUtil.parse("abc")).toBeNull();
    });

    test("returns correct date", () => {
        expect(DateUtil.parse("2018-12-11")).toStrictEqual(new Date("2018-12-11"));
        expect(DateUtil.parse("2018-2-6")).toStrictEqual(new Date(Date.UTC(2018, 1, 6, -8, 0, 0)));
        expect(DateUtil.parse("2018/12/11")).toStrictEqual(new Date(Date.UTC(2018, 11, 11, -8, 0, 0)));
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
        expect(DateUtil.format(date1, "no-year")).toBe("02-12");
        expect(DateUtil.format(date1, "no-year-with-time")).toBe("02-12 12:12:12");
        expect(DateUtil.format(date1, "chinese")).toBe("2018年02月12日");

        const date2 = new Date("2018-2-2 1:1:1");
        expect(DateUtil.format(date2)).toBe("2018-02-02");
        expect(DateUtil.format(date2, "with-time")).toBe("2018-02-02 01:01:01");
        expect(DateUtil.format(date2, "no-year")).toBe("02-02");
        expect(DateUtil.format(date2, "no-year-with-time")).toBe("02-02 01:01:01");
        expect(DateUtil.format(date2, "chinese-with-time")).toBe("2018年02月02日 01:01:01");
    });
});

describe("DateUtil.isSameMinute", () => {
    test("returns true if in same minute", () => {
        const time1 = new Date("2020-01-13 13:50:00");
        const time2 = new Date("2020-01-13 13:50:59"); // same minute
        const time3 = new Date("2020-01-13 13:51:00"); // different minute
        const time4 = new Date("2020-01-13 14:50:00"); // different hour, same minute
        const time5 = new Date("2020-01-14 13:50:00"); // different date, same minute
        const time6 = new Date("2020-02-13 13:50:00"); // different month, same minute
        const time7 = new Date("2021-01-13 13:50:00"); // different year, same minute
        expect(DateUtil.isSameMinute(time1, time2)).toBeTruthy();
        expect(DateUtil.isSameMinute(time1, time3)).toBeFalsy();
        expect(DateUtil.isSameMinute(time1, time4)).toBeFalsy();
        expect(DateUtil.isSameMinute(time1, time5)).toBeFalsy();
        expect(DateUtil.isSameMinute(time1, time6)).toBeFalsy();
        expect(DateUtil.isSameMinute(time1, time7)).toBeFalsy();
    });
});
