import {act, renderHook} from "@testing-library/react";
import {useBool} from "../../../src/hooks/useBool";
import {useExtendedWhen} from "../../../src/hooks/useExtended";

describe("useExtendedWhen unit testing", () => {
    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
    });

    beforeEach(() => {
        jest.useFakeTimers();
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

        act(() => jest.runAllTimers());

        expect(result.current.show).toBeTruthy();
        expect(result.current.extendedShow).toBeTruthy();

        act(() => result.current.close());

        expect(result.current.show).toBeFalsy();
        expect(result.current.extendedShow).toBeTruthy();

        act(() => jest.runAllTimers());

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

        act(() => jest.runAllTimers());

        expect(result.current.show).toBeFalsy();
        expect(result.current.extendedShow).toBeFalsy();
    });
});
