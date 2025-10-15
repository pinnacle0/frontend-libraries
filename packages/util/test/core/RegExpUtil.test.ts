import {RegExpUtil} from "../../src/core/RegExpUtil.js";
import {test, expect} from "vitest";

test("haveCapturingGroup", () => {
    // No capturing groups
    expect(RegExpUtil.haveCapturingGroup(/abc/)).toBe(false);
    expect(RegExpUtil.haveCapturingGroup(/abc(?:def)/)).toBe(false);
    expect(RegExpUtil.haveCapturingGroup(/abc(?=def)/)).toBe(false);
    expect(RegExpUtil.haveCapturingGroup(/abc(?!def)/)).toBe(false);

    // With non-named capturing groups
    expect(RegExpUtil.haveCapturingGroup(/abc(def)/)).toBe(true);
    expect(RegExpUtil.haveCapturingGroup(/(abc)(def)/)).toBe(true);
    expect(RegExpUtil.haveCapturingGroup(/abc(def)ghi(jkl)/)).toBe(true);

    // With named capturing groups
    expect(RegExpUtil.haveCapturingGroup(/abc(?<name>def)/)).toBe(true);
    expect(RegExpUtil.haveCapturingGroup(/(?<first>abc)(?<second>def)/)).toBe(true);

    // Mixed capturing groups
    expect(RegExpUtil.haveCapturingGroup(/(abc)(?<name>def)/)).toBe(true);
    expect(RegExpUtil.haveCapturingGroup(/(?<name>abc)(def)/)).toBe(true);

    // Escaped parentheses (should not count)
    expect(RegExpUtil.haveCapturingGroup(/abc\\(def\\)/)).toBe(false);
    expect(RegExpUtil.haveCapturingGroup(/abc\\(def)/)).toBe(false);
});

test("countNonNamedGroup", () => {
    // No capturing groups
    expect(RegExpUtil.countNonNamedGroup(/abc/)).toBe(0);
    expect(RegExpUtil.countNonNamedGroup(/abc(?:def)/)).toBe(0);
    expect(RegExpUtil.countNonNamedGroup(/abc(?=def)/)).toBe(0);
    expect(RegExpUtil.countNonNamedGroup(/abc(?!def)/)).toBe(0);

    // Single non-named capturing group
    expect(RegExpUtil.countNonNamedGroup(/abc(def)/)).toBe(1);
    expect(RegExpUtil.countNonNamedGroup(/(abc)/)).toBe(1);

    // Multiple non-named capturing groups
    expect(RegExpUtil.countNonNamedGroup(/(abc)(def)/)).toBe(2);
    expect(RegExpUtil.countNonNamedGroup(/(abc)(def)(ghi)/)).toBe(3);
    expect(RegExpUtil.countNonNamedGroup(/abc(def)ghi(jkl)/)).toBe(2);

    // Named capturing groups should not be counted
    expect(RegExpUtil.countNonNamedGroup(/abc(?<name>def)/)).toBe(0);
    expect(RegExpUtil.countNonNamedGroup(/(?<first>abc)(?<second>def)/)).toBe(0);

    // Mixed groups - only count non-named
    expect(RegExpUtil.countNonNamedGroup(/(abc)(?<name>def)/)).toBe(1);
    expect(RegExpUtil.countNonNamedGroup(/(?<name>abc)(def)(ghi)/)).toBe(2);

    // Escaped parentheses should not count
    expect(RegExpUtil.countNonNamedGroup(/abc\\(def\\)/)).toBe(0);
    expect(RegExpUtil.countNonNamedGroup(/abc\\(def)/)).toBe(0);

    // Nested groups
    expect(RegExpUtil.countNonNamedGroup(/((abc))/)).toBe(2);
    expect(RegExpUtil.countNonNamedGroup(/(((abc)))/)).toBe(3);
    expect(RegExpUtil.countNonNamedGroup(/(abc(def))/)).toBe(2);
});

test("listNamedGroup", () => {
    // No named groups
    expect(RegExpUtil.listNamedGroup(/abc/)).toEqual([]);
    expect(RegExpUtil.listNamedGroup(/abc(def)/)).toEqual([]);
    expect(RegExpUtil.listNamedGroup(/(abc)(def)/)).toEqual([]);
    expect(RegExpUtil.listNamedGroup(/abc(?:def)/)).toEqual([]);

    // Single named group
    expect(RegExpUtil.listNamedGroup(/abc(?<name>def)/)).toEqual(["name"]);
    expect(RegExpUtil.listNamedGroup(/(?<word>abc)/)).toEqual(["word"]);

    // Multiple named groups
    expect(RegExpUtil.listNamedGroup(/(?<first>abc)(?<second>def)/)).toEqual(["first", "second"]);
    expect(RegExpUtil.listNamedGroup(/(?<start>abc)def(?<end>ghi)/)).toEqual(["start", "end"]);
    expect(RegExpUtil.listNamedGroup(/(?<a>x)(?<b>y)(?<c>z)/)).toEqual(["a", "b", "c"]);

    // Mixed with non-named groups
    expect(RegExpUtil.listNamedGroup(/(abc)(?<name>def)/)).toEqual(["name"]);
    expect(RegExpUtil.listNamedGroup(/(?<name>abc)(def)/)).toEqual(["name"]);
    expect(RegExpUtil.listNamedGroup(/(abc)(?<first>def)(?<second>ghi)(jkl)/)).toEqual(["first", "second"]);

    // Named groups with special characters in names
    expect(RegExpUtil.listNamedGroup(/(?<name_1>abc)/)).toEqual(["name_1"]);
    expect(RegExpUtil.listNamedGroup(/(?<firstName>abc)(?<lastName>def)/)).toEqual(["firstName", "lastName"]);
    expect(RegExpUtil.listNamedGroup(/(?<group123>abc)/)).toEqual(["group123"]);

    // Nested named groups
    expect(RegExpUtil.listNamedGroup(/(?<outer>(?<inner>abc))/)).toEqual(["outer", "inner"]);
});
