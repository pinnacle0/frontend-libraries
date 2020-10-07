declare module "braft-extensions";

declare module "braft-extensions/dist/table" {
    export interface TableOptions {
        includeEditors?: string[];
        excludeEditors?: string[];
        defaultColumns?: number;
        defaultRows?: number;
        withDropdown?: boolean;
        columnResizable?: boolean;
        exportAttrString?: string;
    }
    const Table: (options?: TableOptions) => object[];
    export default Table;
}
