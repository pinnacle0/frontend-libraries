export type ExportColumn<T> = {
    title: string;
    renderData: (data: T, index: number) => string | number;
};

function exportTxt(filename: string, text: string) {
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    element.setAttribute("download", filename);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function exportCsv<T>(columns: Array<ExportColumn<T>>, data: T[], extraRow?: string) {
    const headerRow: string[] = [];
    const contentRows: string[] = [];
    columns.forEach(column => headerRow.push(column.title));
    data.forEach((_, index) => {
        const contentRow: string[] = [];
        // Embrace with quote("), in case of inside comma(,)
        columns.forEach(column => contentRow.push(`"${column.renderData(_, index)}"`));
        contentRows.push(contentRow.join(","));
    });
    if (extraRow) {
        contentRows.push(extraRow);
    }
    window.open(encodeURI(`data:text/csv;charset=utf-8,${headerRow.join(",")}\n${contentRows.join("\n")}`));
}

export const ExportUtil = Object.freeze({
    exportTxt,
    exportCsv,
});
