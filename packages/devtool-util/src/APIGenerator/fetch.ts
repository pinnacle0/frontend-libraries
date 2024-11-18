import https from "https";
import {SocksProxyAgent} from "socks-proxy-agent";

export function fetch<T>(url: string, socksProxy?: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        https
            .get(url, {agent: socksProxy ? new SocksProxyAgent(socksProxy) : undefined}, res => {
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
