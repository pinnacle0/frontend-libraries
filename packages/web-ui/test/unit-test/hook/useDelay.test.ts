import {act, renderHook} from "@testing-library/react";
import {useBool} from "../../../src/hooks/useBool";
import {useDelayedWhen} from "../../../src/hooks/useDelayed";

describe("useDelay unit testing", () => {
    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
    });

    beforeEach(() => {
        jest.useFakeTimers();
    });

    it("should delay value update", () => {
        const {result} = renderHook(() => {
            const [show, open, close] = useBool(false);
            const delayedShow = useDelayedWhen(show, () => true, 200);

            return {show, open, close, delayedShow};
        });

        expect(result.current.show).toBeFalsy();
        expect(result.current.delayedShow).toBeFalsy();

        act(() => result.current.open());

        expect(result.current.show).toBeTruthy();
        expect(result.current.delayedShow).toBeFalsy();

        act(() => jest.runAllTimers());

        expect(result.current.show).toBeTruthy();
        expect(result.current.delayedShow).toBeTruthy();

        act(() => result.current.close());

        expect(result.current.show).toBeFalsy();
        expect(result.current.delayedShow).toBeTruthy();

        act(() => jest.runAllTimers());
        expect(result.current.show).toBeFalsy();
        expect(result.current.delayedShow).toBeFalsy();
    });

    it("should only delay the update when show is true", () => {
        const {result} = renderHook(() => {
            const [show, open, close] = useBool(false);
            const delayedShow = useDelayedWhen(show, () => show, 200);

            return {show, open, close, delayedShow};
        });

        expect(result.current.show).toBeFalsy();
        expect(result.current.delayedShow).toBeFalsy();

        act(() => result.current.open());

        expect(result.current.show).toBeTruthy();
        expect(result.current.delayedShow).toBeFalsy();

        act(() => jest.runAllTimers());

        expect(result.current.show).toBeTruthy();
        expect(result.current.delayedShow).toBeTruthy();

        act(() => result.current.close());

        expect(result.current.show).toBeFalsy();
        expect(result.current.delayedShow).toBeFalsy();
    });

    it("should given correct result when value change during exceeded timeout", () => {
        const {result} = renderHook(() => {
            const [show, open, close] = useBool(false);
            const delayedShow = useDelayedWhen(show, () => true, 2000);

            return {show, open, close, delayedShow};
        });

        act(() => result.current.open());

        expect(result.current.show).toBeTruthy();
        expect(result.current.delayedShow).toBeFalsy();

        act(() => jest.advanceTimersByTime(100));
        act(() => result.current.close());

        expect(result.current.show).toBeFalsy();
        expect(result.current.delayedShow).toBeFalsy();

        act(() => jest.advanceTimersByTime(100));
        act(() => result.current.open());

        expect(result.current.show).toBeTruthy();
        expect(result.current.delayedShow).toBeFalsy();

        act(() => jest.advanceTimersByTime(2000));

        expect(result.current.delayedShow).toBeTruthy();
    });
});
