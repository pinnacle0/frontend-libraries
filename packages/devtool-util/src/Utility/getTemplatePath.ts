import path from "path";

export function getTemplatePath(name: string) {
    return path.resolve(__dirname, `../../template/${name}`);
}
