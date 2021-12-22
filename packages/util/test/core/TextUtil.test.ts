import {TextUtil} from "../../src/core/TextUtil";

test("Truncate", () => {
    expect(() => TextUtil.truncate("waiting", 4.2)).toThrow();
    expect(() => TextUtil.truncate("waiting", 0)).toThrow();
    expect(() => TextUtil.truncate("waiting", NaN)).toThrow();
    expect(() => TextUtil.truncate("waiting", -20)).toThrow();

    expect(TextUtil.truncate("waiting", 4)).toBe("wait…");
    expect(TextUtil.truncate("waiting", 10)).toBe("waiting");
    expect(TextUtil.truncate("waiting", 4, "~~~")).toBe("wait~~~");
    expect(TextUtil.truncate("waiting", 10, "~~~")).toBe("waiting");

    expect(TextUtil.truncate("一隻🐱", 10, "~~~")).toBe("一隻🐱");
    expect(TextUtil.truncate("一隻🐱", 1, "..")).toBe("一..");
    expect(TextUtil.truncate("一隻🐱", 2, "..")).toBe("一隻..");
    expect(TextUtil.truncate("一隻🐱", 3, "..")).toBe("一隻🐱");
    expect(TextUtil.truncate("一隻🐱", 4, "..")).toBe("一隻🐱");
});

test("Split By Chars", () => {
    expect(() => TextUtil.splitByLength("abcde", 0, " ")).toThrow();
    expect(() => TextUtil.splitByLength("abcdef", 2.6, " ")).toThrow();
    expect(TextUtil.splitByLength("abcde", 2, " ")).toBe("ab cd e");
    expect(TextUtil.splitByLength("abcdef", 2, " ")).toBe("ab cd ef");
    expect(TextUtil.splitByLength("abcdef", 3, " ")).toBe("abc def");
    expect(TextUtil.splitByLength("abcdef", 4, " ")).toBe("abcd ef");
    expect(TextUtil.splitByLength("abcdef", 5, " ")).toBe("abcde f");
    expect(TextUtil.splitByLength("abcdef", 6, " ")).toBe("abcdef");
    expect(TextUtil.splitByLength("abcdef", 7, " ")).toBe("abcdef");
    expect(TextUtil.splitByLength("abcdef", 1, "|")).toBe("a|b|c|d|e|f");
    expect(TextUtil.splitByLength("", 1, "|")).toBe("");
});

test("Interpolate", () => {
    expect(TextUtil.interpolate("{1} {2}", "hello", "world")).toBe("hello world");
    expect(TextUtil.interpolate("{2} {3} {1}", "jest", "This", "is")).toBe("This is jest");
    expect(TextUtil.interpolate("{3} {2} {1}", "a", "b", "c")).toBe("c b a");
});

test("stripHTML", () => {
    expect(TextUtil.stripHTML("123")).toBe("123");
    expect(TextUtil.stripHTML(`<html><p>123</p></html>`)).toBe("123");
    expect(TextUtil.stripHTML(`<html><p class="a">123</p></html>`)).toBe("123");
    expect(
        TextUtil.stripHTML(`<p><span style="background-color:rgb(242,242,243);color:rgba(0,0,0,0.85);font-size:16px;">
    &nbsp;&nbsp;
    修改并重发站内信&nbsp;：&nbsp;信内站发重并改修</span></p>

    &nbsp;&nbsp;`)
    ).toEqual("修改并重发站内信 ： 信内站发重并改修");
    expect(
        TextUtil.stripHTML(`
        <html>
            <p>321,
                <a>123</a>
            </p>
        </html>`)
    ).toBe("321,\n123");
});
