/* eslint-disable react/jsx-fragments, react/jsx-uses-react, react/react-in-jsx-scope -- new jsx transform */

import {writeFileSync} from "fs";
import {join} from "path";
import {renderToStaticMarkup} from "react-dom/server";
import {UglyImage} from "./ugly-image";

const outputFilepath = join(__dirname, "../../../README_LOGO.svg");

const contents = renderToStaticMarkup(<UglyImage />);

writeFileSync(outputFilepath, contents, {encoding: "utf8"});
