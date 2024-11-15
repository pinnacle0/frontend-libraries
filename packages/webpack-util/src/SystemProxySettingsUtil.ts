import os from "os";
import {execSync, spawnSync} from "child_process";

interface ProxySettings {
    server: string;
    port: number;
}

/**
 * Create a socks proxy agent.
 * getSocketsProxySettings only work on Mac, (sorry for windows and linux user)
 */
export class SystemProxySettingsUtil {
    static get(): ProxySettings | null {
        if (os.platform() !== "darwin") return null;

        const which = spawnSync("which", ["networksetup"]);
        if (which.status !== 0) return null;
        const bin = which.stdout.toString().trim();

        const listDevices = spawnSync(bin, ["-listallnetworkservices"]);
        if (listDevices.status !== 0) return null;
        const devices = listDevices.stdout.toString().trim().split("\n").slice(1);

        for (const device of devices) {
            const getSettings = spawnSync(bin, ["-getwebproxy", device]);
            if (getSettings.status !== 0) continue;
            const settings = this.parseRawWebProxySettings(getSettings.stdout.toString().trim());
            if (settings) return settings;
        }
        return null;
    }

    static isV2RayDockerRunning(): boolean {
        try {
            const output = execSync("docker ps", {encoding: "utf8"});
            const lines = output.split("\n");
            for (const line of lines) {
                if (line.includes("v2ray")) {
                    return true;
                }
            }
        } catch (error) {
            console.error("Error checking if V2Ray Docker container is running:", error);
        }
        return false;
    }

    private static parseRawWebProxySettings(raw: string): ProxySettings | null {
        const setting = raw.split("\n").reduce(
            (settings, line) => {
                const [key, value] = line.split(":").map(s => s.trim());
                if (key === "Enabled") {
                    settings.enabled = value === "Yes";
                } else if (key === "Server") {
                    settings.server = value;
                } else if (key === "Port") {
                    settings.port = Number(value);
                }
                return settings;
            },
            {} as ProxySettings & {enabled: boolean}
        );

        return setting.enabled ? {server: setting.server, port: setting.port} : null;
    }
}
