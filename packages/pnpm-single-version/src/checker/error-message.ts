import chalk from "chalk";
import type {LoggerType, PackageInfo} from "../type.js";

const Emoji = {
    sad: "😔",
    cross: "❌",
    happy: "🤗",
};

const headerMessage = (num: number) => `${Emoji.cross} Found ${chalk.redBright(num)} Non-single version dependencies\n`;

const listVersionMessage = (name: string, infos: PackageInfo[]): string =>
    `
    - ${chalk.blueBright(name)} has ${chalk.redBright(infos.length)} distinct versions 
      ${infos.map(_ => _.version + (_.peersSuffix ?? "")).join(", ")}
`;

const hintMessage = `
Well, here is what you can try to do:
Run ${chalk.blueBright(`$ pnpm why <dependency> -r `)} on project root to figure out the dependencies that contain conflicted version. 
If the output is too long, try to redirect output, like ${chalk.blueBright(`$ pnpm why <dependency> -r > example.txt`)}
more about ${chalk.blueBright(`$ pnpm why`)} command, check out ${chalk.greenBright("https://pnpm.io/cli/why")} 
`;

export function createErrorMessage(nonSingleVersionDeps: Map<string, PackageInfo[]>): string | null {
    if (nonSingleVersionDeps.size === 0) {
        return null;
    }
    let message = headerMessage(nonSingleVersionDeps.size);
    for (const [name, infos] of nonSingleVersionDeps.entries()) {
        message += listVersionMessage(name, infos);
    }

    message += hintMessage;

    return message;
}

export const logInstallationInterruptedMessage = (logger: LoggerType) => {
    logger.message(`${Emoji.sad} ${chalk.red("Installation Process interrupted.")}`);
};

/**
 *
 * @param {string | null} message
 * @returns {boolean} Any Error message logged
 */
export const logErrorMessage =
    (logger: LoggerType) =>
    (message: string | null): boolean => {
        if (!message) {
            logger.message(`${Emoji.happy} All Passed!!!`);
            return false;
        } else {
            logger.message(message);
            return true;
        }
    };
