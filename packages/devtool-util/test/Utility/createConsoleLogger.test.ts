import {Utility} from "../../src/Utility";

describe("Utility.createConsoleLogger (smoke tests)", () => {
    test("can create a logger instance", () => {
        const print = Utility.createConsoleLogger("don't care");
        expect(print).toBeDefined();
        expect(typeof print.error).toBe("function");
        expect(typeof print.info).toBe("function");
        expect(typeof print.task).toBe("function");
    });

    test("logs to console", () => {
        const consoleSpy = jest.spyOn(console, "info").mockImplementation(() => {});
        const print = Utility.createConsoleLogger("don't care");

        consoleSpy.mockClear();
        print.error("SOME_MESSAGE_HERE");
        expect(consoleSpy).toHaveBeenLastCalledWith(expect.stringContaining("SOME_MESSAGE_HERE"));

        consoleSpy.mockClear();
        print.info("SOME_MORE_MESSAGE_HERE");
        expect(consoleSpy).toHaveBeenLastCalledWith(expect.stringMatching("SOME_MORE_MESSAGE_HERE"));

        consoleSpy.mockClear();
        print.task("ANOTHER_MESSAGE_HERE");
        expect(consoleSpy).toHaveBeenLastCalledWith(expect.stringMatching("ANOTHER_MESSAGE_HERE"));
    });
});
