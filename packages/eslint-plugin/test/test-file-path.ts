import path from "path";
import {pathMap} from "../config/path-map";

const {testDirectory} = pathMap;

export function testFilePath(relativePath: string): string {
    return path.join(testDirectory, "files", relativePath);
}
