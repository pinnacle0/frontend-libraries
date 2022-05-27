import {Row, Col} from "antd";
import "antd/lib/grid/style";

interface GridType {
    Row: typeof Row;
    Column: typeof Col;
}

export const Grid: GridType = Object.freeze({
    Row,
    Column: Col,
});
