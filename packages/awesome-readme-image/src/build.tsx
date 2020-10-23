import {writeFileSync} from "fs";
import {join} from "path";
import {renderToStaticMarkup} from "react-dom/server";
import {UglyImage} from "./ugly-image";

/* eslint-disable @typescript-eslint/no-use-before-define, react/jsx-fragments, react/jsx-uses-react, react/react-in-jsx-scope -- React 16.14.0 */
declare const React: null;

const outputFilepath = join(__dirname, "../../../README_LOGO.svg");

const contents = renderToStaticMarkup(<UglyImage />);

writeFileSync(outputFilepath, contents, {encoding: "utf8"});
