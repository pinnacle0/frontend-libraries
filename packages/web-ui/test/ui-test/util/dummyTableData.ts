import type {TableColumns} from "@pinnacle0/web-ui/core/Table";

export interface MockTableData {
    id: number;
    name: string;
    time: Date;
}

export function generateDummyTableData(length: number, base: number = 1): MockTableData[] {
    const data: MockTableData[] = [];
    for (let i = base; i <= base + length - 1; i++) {
        data.push({
            id: i,
            name: "Name - " + i,
            time: new Date(),
        });
    }
    return data;
}

export const dummyTableColumns: TableColumns<MockTableData> = [
    {
        title: "ID",
        customizedKey: "id",
        width: 99,
        renderData: _ => _.id,
    },
    {
        title: "Name",
        renderData: _ => _.name,
    },
    {
        title: "Locale Time",
        renderData: _ => _.time.toLocaleString(),
    },
];

export const dummyTableWideColumns: TableColumns<MockTableData> = [
    {
        title: "ID",
        width: 99,
        fixed: "left",
        renderData: _ => _.id,
    },
    ...["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"].map(letter => ({
        title: `Name ${letter}`,
        renderData: (_: MockTableData) => _.name + "/" + letter,
    })),
    {
        title: "Locale Time",
        fixed: "right",
        renderData: _ => _.time.toLocaleString(),
    },
];
