import {pushToList} from "../../src/util/RecentUsedStorageUtil/pushToList";

interface TestEachRowSchema {
    list: number[];
    newItem: number;
    maxSize: number;
    actionOnDuplicate: "keep" | "reorder";
    actionOnInsert: "start" | "end";
    expected: number[];
}

describe("RecentUsedStorageUtil/PushToList testing", () => {
    test.each`
        list               | newItem | maxSize | actionOnDuplicate | actionOnInsert | expected
        ${[1, 2, 3, 4]}    | ${5}    | ${5}    | ${"keep"}         | ${"start"}     | ${[5, 1, 2, 3, 4]}
        ${[1, 2, 3, 4]}    | ${5}    | ${5}    | ${"keep"}         | ${"end"}       | ${[1, 2, 3, 4, 5]}
        ${[1, 2, 3, 4]}    | ${2}    | ${5}    | ${"keep"}         | ${"start"}     | ${[1, 2, 3, 4]}
        ${[1, 2, 3, 4]}    | ${2}    | ${5}    | ${"keep"}         | ${"end"}       | ${[1, 2, 3, 4]}
        ${[1, 2, 3, 4]}    | ${2}    | ${5}    | ${"reorder"}      | ${"start"}     | ${[2, 1, 3, 4]}
        ${[1, 2, 3, 4]}    | ${2}    | ${5}    | ${"reorder"}      | ${"end"}       | ${[1, 3, 4, 2]}
        ${[1, 2, 3, 4, 5]} | ${2}    | ${5}    | ${"keep"}         | ${"start"}     | ${[1, 2, 3, 4, 5]}
        ${[1, 2, 3, 4, 5]} | ${2}    | ${5}    | ${"keep"}         | ${"end"}       | ${[1, 2, 3, 4, 5]}
        ${[1, 2, 3, 4, 5]} | ${2}    | ${5}    | ${"reorder"}      | ${"start"}     | ${[2, 1, 3, 4, 5]}
        ${[1, 2, 3, 4, 5]} | ${2}    | ${5}    | ${"reorder"}      | ${"end"}       | ${[1, 3, 4, 5, 2]}
    `("PushToList($list, $newItem, $maxSize, $actionOnDuplicate, $actionOnInsert) returns $expected", ({list, newItem, maxSize, actionOnDuplicate, actionOnInsert, expected}: TestEachRowSchema) => {
        expect(pushToList(list, newItem, maxSize, actionOnDuplicate, actionOnInsert).toString()).toBe(expected.toString());
    });
});
