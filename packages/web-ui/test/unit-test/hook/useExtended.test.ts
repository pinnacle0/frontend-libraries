import React from "react";
import {act, renderHook} from "@testing-library/react";
import {useBool} from "../../../src/hooks/useBool";
import {useExtendedWhen} from "../../../src/hooks/useExtended";
import {describe, afterEach, beforeEach, it, expect, vi} from "vitest";

describe("useExtendedWhen unit testing", () => {
    afterEach(() => {
        vi.clearAllTimers();
        vi.useRealTimers();
    });

    beforeEach(() => {
        vi.useFakeTimers();
    });

    it("should extend value update", () => {
        const {result} = renderHook(() => {
            const [show, open, close] = useBool(false);
            const extendedShow = useExtendedWhen(show, () => true, 500);

            return {show, open, close, extendedShow};
        });

        expect(result.current.show).toBeFalsy();
        expect(result.current.extendedShow).toBeFalsy();

        act(() => result.current.open());

        expect(result.current.show).toBeTruthy();
        expect(result.current.extendedShow).toBeFalsy();

        act(() => vi.runAllTimers());

        expect(result.current.show).toBeTruthy();
        expect(result.current.extendedShow).toBeTruthy();

        act(() => result.current.close());

        expect(result.current.show).toBeFalsy();
        expect(result.current.extendedShow).toBeTruthy();

        act(() => vi.runAllTimers());

        expect(result.current.show).toBeFalsy();
        expect(result.current.extendedShow).toBeFalsy();
    });

    it("should only extend the update when show is true", () => {
        const {result} = renderHook(() => {
            const [show, open, close] = useBool(false);
            const extendedShow = useExtendedWhen(show, show => show === true, 500);

            return {show, open, close, extendedShow};
        });

        expect(result.current.show).toBeFalsy();
        expect(result.current.extendedShow).toBeFalsy();

        act(() => result.current.open());

        expect(result.current.show).toBeTruthy();
        expect(result.current.extendedShow).toBeTruthy();

        act(() => result.current.close());

        expect(result.current.show).toBeFalsy();
        expect(result.current.extendedShow).toBeTruthy();

        act(() => vi.runAllTimers());

        expect(result.current.show).toBeFalsy();
        expect(result.current.extendedShow).toBeFalsy();

        act(() => result.current.open());

        expect(result.current.show).toBeTruthy();
        expect(result.current.extendedShow).toBeTruthy();

        act(() => result.current.close());

        expect(result.current.show).toBeFalsy();
        expect(result.current.extendedShow).toBeTruthy();

        act(() => vi.runAllTimers());

        expect(result.current.show).toBeFalsy();
        expect(result.current.extendedShow).toBeFalsy();
    });

    it("should only show the latest value after minDuration", () => {
        const {result} = renderHook(() => {
            const [value, setValue] = React.useState(0);
            const extendedValue = useExtendedWhen(value, value => value === 3, 500);

            return {value, setValue, extendedValue};
        });

        expect(result.current.value).toBe(0);
        expect(result.current.extendedValue).toBe(0);

        act(() => result.current.setValue(1));

        expect(result.current.value).toBe(1);
        expect(result.current.extendedValue).toBe(1);

        act(() => result.current.setValue(3));

        expect(result.current.value).toBe(3);
        expect(result.current.extendedValue).toBe(3);

        act(() => result.current.setValue(4));

        expect(result.current.value).toBe(4);
        expect(result.current.extendedValue).toBe(3);

        act(() => result.current.setValue(5));
        act(() => result.current.setValue(6));
        act(() => result.current.setValue(7));

        expect(result.current.value).toBe(7);
        expect(result.current.extendedValue).toBe(3);

        act(() => vi.runAllTimers());

        expect(result.current.value).toBe(7);
        expect(result.current.extendedValue).toBe(7);
    });
});
