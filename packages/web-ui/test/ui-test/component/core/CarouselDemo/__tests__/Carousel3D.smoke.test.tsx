import {Carousel3D} from "@pinnacle0/web-ui/core/Carousel3D";
import {render} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import {generateDummyURLs} from "test/ui-test/util/dummyList";

describe("Carousel3D", () => {
    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    test("calls setTimeout and setTimeout correctly", () => {
        render(
            <Carousel3D>
                {generateDummyURLs(2).map((url, index) => (
                    <img src={url} key={index} />
                ))}
            </Carousel3D>
        );

        const pagination = document.querySelectorAll(".pagination > div")[1];

        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 3000);
        expect(clearTimeout).toHaveBeenCalledTimes(0);
        userEvent.click(pagination);
        expect(clearTimeout).toHaveBeenCalledWith(expect.any(Number));
        expect(clearTimeout).toHaveBeenCalledTimes(1);
        userEvent.hover(pagination);
        expect(clearTimeout).toHaveBeenCalledTimes(2);
        userEvent.unhover(pagination);
        expect(setTimeout).toHaveBeenCalledTimes(2);
    });
});
