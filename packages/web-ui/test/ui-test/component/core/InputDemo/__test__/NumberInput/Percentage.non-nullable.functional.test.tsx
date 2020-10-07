import "@testing-library/jest-dom"; // For extending types
import "@testing-library/jest-dom/extend-expect";

import {NumberInputPercentage} from "@pinnacle0/web-ui/core/NumberInput/NumberInputPercentage";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

type BanNullProps = import("@pinnacle0/web-ui/core/NumberInput/NumberInputPercentage").Props<false>;

describe("NumberInput.Percentage (non-nullable, functional test)", () => {
    const renderInputComponent = (inputComponent: React.ReactElement<typeof NumberInputPercentage>) => {
        const {rerender} = render(inputComponent);
        const inputElement = screen.getByRole("textbox") as HTMLInputElement;
        const buttons = screen.getAllByRole("button") as HTMLButtonElement[];
        const addButton = buttons.find(_ => _.className.toLowerCase().includes("add"))!;
        const minusButton = buttons.find(_ => _.className.toLowerCase().includes("minus"))!;
        return {inputElement, addButton, minusButton, rerender};
    };

    test("percentageScale 2 has default step of `0.01%` (stepped)", () => {
        const initialValue = 0.8;
        const expectedAfterAddValue = 0.8001;
        const mockOnChange = jest.fn<void, [number]>();
        const props: BanNullProps = {
            percentageStep: undefined, // use default
            value: initialValue,
            onChange: mockOnChange,
            allowNull: false,
            percentageScale: 2,
            stepperMode: "always",
        };
        const {inputElement, addButton, rerender} = renderInputComponent(<NumberInputPercentage {...props} />);

        expect(inputElement).toBeTruthy(), expect(addButton).toBeTruthy();
        expect(inputElement).not.toHaveFocus(), expect(addButton).not.toHaveFocus();
        expect(mockOnChange).not.toHaveBeenCalled();
        expect(inputElement.value).toBe("80.00 %");

        mockOnChange.mockClear();
        userEvent.click(addButton);
        expect(inputElement).not.toHaveFocus(), expect(addButton).toHaveFocus();
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(mockOnChange).toHaveBeenLastCalledWith(expectedAfterAddValue);
        rerender(<NumberInputPercentage {...props} value={expectedAfterAddValue} />); // Parent onChange called, pass new props to component
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(inputElement.value).toBe("80.01 %");
    });

    test("percentageScale 2 with percentageStep 10 adds `10%` each time (stepped)", () => {
        const initialValue = 0.8;
        const expectedAfterAddValue = 0.9;
        const mockOnChange = jest.fn<void, [number]>();
        const props: BanNullProps = {
            percentageStep: 10,
            value: initialValue,
            onChange: mockOnChange,
            allowNull: false,
            percentageScale: 2,
            stepperMode: "always",
        };
        const {inputElement, addButton, rerender} = renderInputComponent(<NumberInputPercentage {...props} />);

        expect(inputElement).toBeTruthy(), expect(addButton).toBeTruthy();
        expect(inputElement).not.toHaveFocus(), expect(addButton).not.toHaveFocus();
        expect(mockOnChange).not.toHaveBeenCalled();
        expect(inputElement.value).toBe("80.00 %");

        mockOnChange.mockClear();
        userEvent.click(addButton);
        expect(inputElement).not.toHaveFocus(), expect(addButton).toHaveFocus();
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(mockOnChange).toHaveBeenLastCalledWith(expectedAfterAddValue);
        rerender(<NumberInputPercentage {...props} value={expectedAfterAddValue} />); // Parent onChange called, pass new props to component
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(inputElement.value).toBe("90.00 %");
    });

    test("percentageScale 2 converts user input value to percentage (non-stepped)", () => {
        const initialValue = 0.8;
        const mockOnChange = jest.fn<void, [number]>();
        const props: BanNullProps = {
            value: initialValue,
            onChange: mockOnChange,
            allowNull: false,
            percentageScale: 2,
            stepperMode: "none",
        };
        const {inputElement, rerender} = renderInputComponent(<NumberInputPercentage {...props} />);

        expect(inputElement).toBeTruthy();
        expect(inputElement).not.toHaveFocus();
        expect(mockOnChange).not.toHaveBeenCalled();
        expect(inputElement.value).toBe("80.00 %");

        mockOnChange.mockClear();
        userEvent.click(inputElement);
        expect(inputElement).toHaveFocus();
        expect(inputElement.value).toBe("80");

        mockOnChange.mockClear();
        userEvent.type(inputElement, "{backspace}2", {skipClick: true});
        expect(mockOnChange).toHaveBeenCalledTimes(2);
        expect(mockOnChange).toHaveBeenLastCalledWith(0.82);
        rerender(<NumberInputPercentage {...props} value={0.82} />); // Parent onChange called, pass new props to component
        expect(mockOnChange).toHaveBeenCalledTimes(2);
        expect(inputElement.value).toBe("82");

        mockOnChange.mockClear();
        userEvent.click(document.body);
        expect(inputElement).not.toHaveFocus();
        expect(mockOnChange).not.toHaveBeenCalled();
        expect(inputElement.value).toBe("82.00 %");
    });

    test("percentageScale 0 percentageScale 5 clicking stepped button when user input is focused preserves last valid value", () => {
        const mockOnChange = jest.fn<void, [number]>();
        const props: BanNullProps = {
            value: 0.5,
            onChange: mockOnChange,
            allowNull: false,
            percentageScale: 0,
            percentageStep: 5,
            stepperMode: "always",
        };
        const {inputElement, addButton, rerender} = renderInputComponent(<NumberInputPercentage {...props} />);

        expect(inputElement).toBeTruthy(), expect(addButton).toBeTruthy();
        expect(inputElement).not.toHaveFocus(), expect(addButton).not.toHaveFocus();
        expect(mockOnChange).not.toHaveBeenCalled();
        expect(inputElement.value).toBe("50 %");

        mockOnChange.mockClear();
        userEvent.type(inputElement, "{backspace}1");
        expect(inputElement).toHaveFocus();
        expect(mockOnChange).toHaveBeenCalledTimes(2);
        expect(mockOnChange).toHaveBeenLastCalledWith(0.51);
        rerender(<NumberInputPercentage {...props} value={0.51} />); // Parent onChange called, pass new props to component
        expect(mockOnChange).toHaveBeenCalledTimes(2);
        expect(inputElement.value).toBe("51");

        mockOnChange.mockClear();
        userEvent.click(addButton);
        expect(inputElement).not.toHaveFocus(), expect(addButton).toHaveFocus();
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(mockOnChange).toHaveBeenLastCalledWith(0.56);
        rerender(<NumberInputPercentage {...props} value={0.56} />);
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(inputElement.value).toBe("56 %");
    });
});
