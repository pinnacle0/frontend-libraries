import React from "react";
import {describe, test, expect, beforeAll, afterAll} from "vitest";
import {render, cleanup} from "@testing-library/react";
import {ChinaDateCalendar} from "../../src/core/ChinaDateCalendar";
import {ChinaDatePicker} from "../../src/core/ChinaDatePicker";
import {ChinaDateRangePicker} from "../../src/core/ChinaDateRangePicker";
import {ChinaDateTimePicker} from "../../src/core/ChinaDateTimePicker";
import {ChinaDateTimeRangePicker} from "../../src/core/ChinaDateTimeRangePicker";
import {ChinaTimePicker} from "../../src/core/ChinaTimePicker";
import {ChinaTimeRangePicker} from "../../src/core/ChinaTimeRangePicker";

/**
 * These tests run under a non-Beijing machine timezone (forced below). The `China*` components must
 * ignore the machine timezone and always render Beijing time (UTC+8).
 *
 * The instant 2024-06-15T00:00:00Z is 08:00 on 2024-06-15 in Beijing but 20:00 on the previous day
 * in America/New_York; 2024-06-16T13:00:00Z is 21:00 on 2024-06-16 in Beijing.
 */
const originalTZ = process.env.TZ;

beforeAll(() => {
    // Force a non-Beijing machine timezone so the tests exercise timezone-independence even when the
    // build runs on a machine that happens to be in Beijing time. Node re-reads `process.env.TZ` at runtime.
    process.env.TZ = "America/New_York";

    // AntD's RangePicker observes element size; jsdom has no ResizeObserver.
    globalThis.ResizeObserver ??= class {
        observe() {}
        unobserve() {}
        disconnect() {}
    } as unknown as typeof ResizeObserver;
});

afterAll(() => {
    process.env.TZ = originalTZ;
});

const noop = () => undefined;
const BEIJING_0800 = new Date("2024-06-15T00:00:00Z");
const BEIJING_2100 = new Date("2024-06-16T13:00:00Z");

function inputValues(container: HTMLElement): string[] {
    return Array.from(container.querySelectorAll("input")).map(input => (input as HTMLInputElement).value);
}

describe("China* pickers always display Beijing time (machine timezone is not Beijing)", () => {
    test("machine really is not in Beijing time for this run", () => {
        // Guards the premise: if this fails, the test forgot to force a foreign TZ.
        expect(new Date().getTimezoneOffset()).not.toBe(-480);
    });

    test("ChinaDatePicker renders a date string as the same Beijing calendar day", () => {
        const {container} = render(<ChinaDatePicker allowNull={false} value="2024-06-15" onChange={noop} />);
        expect(inputValues(container)).toEqual(["2024-06-15"]);
        cleanup();
    });

    test("ChinaDateRangePicker renders both endpoints as Beijing calendar days", () => {
        const {container} = render(<ChinaDateRangePicker allowNull={false} value={["2024-06-15", "2024-06-20"]} onChange={noop} />);
        expect(inputValues(container)).toEqual(["2024-06-15", "2024-06-20"]);
        cleanup();
    });

    test("ChinaDateTimePicker renders a Date instant in Beijing time", () => {
        const {container} = render(<ChinaDateTimePicker allowNull={false} value={BEIJING_0800} onChange={noop} />);
        expect(inputValues(container)).toEqual(["2024-06-15 08:00:00"]);
        cleanup();
    });

    test("ChinaDateTimeRangePicker renders both instants in Beijing time", () => {
        const {container} = render(<ChinaDateTimeRangePicker allowNull={false} value={[BEIJING_0800, BEIJING_2100]} onChange={noop} />);
        expect(inputValues(container)).toEqual(["2024-06-15 08:00:00", "2024-06-16 21:00:00"]);
        cleanup();
    });

    test("ChinaTimePicker renders a time-of-day unchanged", () => {
        const {container} = render(<ChinaTimePicker allowNull={false} value="09:30:00" onChange={noop} />);
        expect(inputValues(container)).toEqual(["09:30:00"]);
        cleanup();
    });

    test("ChinaTimeRangePicker renders both times unchanged", () => {
        const {container} = render(<ChinaTimeRangePicker allowNull={false} value={["09:30:00", "18:45:00"]} onChange={noop} />);
        expect(inputValues(container)).toEqual(["09:30:00", "18:45:00"]);
        cleanup();
    });

    test("ChinaDateCalendar selects the value as a Beijing calendar day", () => {
        const {container} = render(<ChinaDateCalendar value="2024-06-15" onChange={noop} />);
        const selectedCell = container.querySelector(".ant-picker-cell-selected");
        expect(selectedCell?.getAttribute("title")).toBe("2024-06-15");
        cleanup();
    });
});
