import {writeFileSync} from "fs";
import path from "path";
import {renderToStaticMarkup} from "react-dom/server";
import {fileURLToPath} from "url";
import {UglyImage} from "./ugly-image";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const outputFilepath = path.join(dirname, "../../../README_LOGO.svg");

const contents = renderToStaticMarkup(<UglyImage />);

writeFileSync(outputFilepath, contents, {encoding: "utf8"});
