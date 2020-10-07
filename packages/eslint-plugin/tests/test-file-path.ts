import * as path from "path";

export function testFilePath(relativePath: string): string {
    return path.join(process.cwd(), "./tests/files", relativePath);
}
