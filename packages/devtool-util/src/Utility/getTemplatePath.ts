import path from "path";

export function getTemplatePath(name: string) {
    return path.resolve(import.meta.dirname, `../../template/${name}`);
}
