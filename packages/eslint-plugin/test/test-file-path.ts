import * as path from "path";
import {paths} from "../tools/paths";

const {testDirectory} = paths;

export function testFilePath(relativePath: string): string {
    return path.join(testDirectory, "files", relativePath);
}
