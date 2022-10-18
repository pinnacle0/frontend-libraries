import https from "https";

export function fetch<T>(url: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        https
            .get(url, res => {
                const contentType = res.headers["content-type"];
                if (res.statusCode !== 200) {
                    reject(new Error(`Request failed, status code: ${res.statusCode}`));
                } else if (!contentType?.includes("application/json")) {
                    reject(new Error(`Unexpected contentType: ${contentType}`));
                }

                res.setEncoding("utf8");
                let buffer = "";
                res.on("data", data => {
                    buffer += data;
                });

                res.on("end", () => {
                    try {
                        resolve(JSON.parse(buffer));
                    } catch (error) {
                        reject(error);
                    }
                });
            })
            .on("error", reject);
    });
}
