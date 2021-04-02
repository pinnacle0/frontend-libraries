import React from "react";
import {Button} from "@pinnacle0/web-ui/core/Button";
import {render} from "@testing-library/react";

describe("Button (dom snapshot test)", () => {
    test('render with children: "button children text"', () => {
        const {container} = render(<Button>button children text</Button>);
        expect(container).toMatchSnapshot();
    });
});
