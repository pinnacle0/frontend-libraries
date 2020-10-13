async function importTxt(files: FileList | null | undefined): Promise<string | null> {
    if (files && files[0]) {
        const file = files[0];
        if (file.type.match(/text.*/)) {
            return new Promise<string | null>(resolve => {
                const fileReader = new FileReader();
                fileReader.onload = () => {
                    const rawContent = fileReader.result?.toString();
                    if (rawContent) {
                        resolve(rawContent);
                    } else {
                        resolve(null);
                    }
                };
                fileReader.onerror = () => resolve(null);
                fileReader.readAsText(file);
            });
        }
    }
    return null;
}

async function importTxtInLines(files: FileList | null | undefined): Promise<string[] | null> {
    const content = await importTxt(files);
    if (content) {
        return content
            .split("\n")
            .map(_ => _.trim())
            .filter(_ => _);
    } else {
        return null;
    }
}

export const ImportUtil = {
    importTxt,
    importTxtInLines,
};
