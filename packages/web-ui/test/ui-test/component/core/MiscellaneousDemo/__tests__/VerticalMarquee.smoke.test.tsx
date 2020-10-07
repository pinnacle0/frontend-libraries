import {VerticalMarquee} from "@pinnacle0/web-ui/core/VerticalMarquee";
import {render} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import {generateDummyStrings} from "test/ui-test/util/dummyList";

const dummyStrings = generateDummyStrings(10);

describe("VerticalMarquee", () => {
    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterAll(() => {
        jest.restoreAllMocks();
        jest.useRealTimers();
    });

    test("when marque scrollHeight less than clientHeight", () => {
        jest.spyOn(HTMLElement.prototype, "clientHeight", "get").mockImplementation(() => 100);
        jest.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockImplementation(() => 99);

        const className = "vertical-marquee-1";
        render(
            <VerticalMarquee className={className}>
                {dummyStrings.map(text => (
                    <div key={text}>{text}</div>
                ))}
            </VerticalMarquee>
        );
        const marquee = document.querySelector(`.${className}`)!;

        expect(setInterval).toHaveBeenCalledTimes(0);
        expect(clearInterval).toHaveBeenCalledTimes(0);
        userEvent.hover(marquee);
        expect(setInterval).toHaveBeenCalledTimes(0);
        expect(clearInterval).toHaveBeenCalledTimes(1);
        userEvent.unhover(marquee);
        expect(setInterval).toHaveBeenCalledTimes(0);
        expect(clearInterval).toHaveBeenCalledTimes(1);
    });

    test("when marque scrollHeight more than clientHeight", async () => {
        /**
         * CAVEATS:
         *  1. mock all element's clientHeigh and scrollHeight, which is not good
         *  2. because of jsdom don't render the layout of components, overwrite marquee's
         *     clientHeight and scrollHeight directly can't simulate real scenario of marquee
         *     inherit the height of its parent node
         */
        jest.spyOn(HTMLElement.prototype, "clientHeight", "get").mockImplementation(() => 100);
        jest.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockImplementation(() => 111);

        const className = "vertical-marquee-2";
        const marqueeChildClassName = "marquee-child";
        render(
            <VerticalMarquee className={className}>
                {dummyStrings.map(text => (
                    <div key={text} className={marqueeChildClassName}>
                        {text}
                    </div>
                ))}
            </VerticalMarquee>
        );

        const marquee = document.querySelector(`.${className}`)!;
        const marqueeChildren = document.querySelectorAll(`.${marqueeChildClassName}`);

        // have shadow children
        expect(marqueeChildren).toHaveLength(dummyStrings.length * 2);

        expect(setInterval).toHaveBeenCalledTimes(1);
        expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 30); // default speed
        expect(clearInterval).toHaveBeenCalledTimes(0);
        userEvent.hover(marquee);
        expect(clearInterval).toHaveBeenCalledTimes(1);
        expect(clearInterval).toHaveBeenCalledWith(expect.any(Number));
        userEvent.unhover(marquee);
        expect(setInterval).toHaveBeenCalledTimes(2);
        expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 30);
    });
});
