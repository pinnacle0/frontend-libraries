import {pushToList} from "./pushToList";
/**
 * In mobile Safari, the user may turn on "Block All Cookies".
 * In such situation, accessing to localStorage will throw error.
 */

type ListItemType = string | number | boolean;

function get<T extends ListItemType>(key: string, validator?: T[]): T[] {
    try {
        const rawData = localStorage.getItem(key);
        if (rawData) {
            const parsedList: unknown = JSON.parse(rawData);
            if (Array.isArray(parsedList)) {
                return (parsedList as T[]).filter(_ => !validator || validator.includes(_));
            }
        }
        return [];
    } catch {
        return [];
    }
}

interface Option {
    maxSize: number;
    actionOnDuplicate: "keep" | "reorder";
    actionOnInsert: "start" | "end";
}

function put<T extends ListItemType>(key: string, value: T, option: Partial<Option> = {}): void {
    try {
        const maxSize = option.maxSize || 5;
        const actionOnDuplicate = option.actionOnDuplicate || "reorder";
        const actionOnInsert = option.actionOnInsert || "end";
        const list = get(key);
        const newList = pushToList(list, value, maxSize, actionOnDuplicate, actionOnInsert);
        localStorage.setItem(key, JSON.stringify(newList));
    } catch {
        // Do nothing
    }
}

export const RecentUsedStorageUtil = Object.freeze({
    get,
    put,
});
