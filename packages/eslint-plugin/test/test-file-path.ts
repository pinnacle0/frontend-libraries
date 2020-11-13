import path from "path";

export function testFilePath(relativePath: string): string {
    return path.join(__dirname, "../test/files", relativePath);
}
