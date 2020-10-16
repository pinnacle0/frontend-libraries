import {imageRule} from "./image.rule";
import {otherRule} from "./other.rule";
import {stylesheetRule} from "./stylesheet.rule";
import {tsRule} from "./ts.rule";

export const Rule = Object.freeze({
    image: imageRule,
    other: otherRule,
    ts: tsRule,
    stylesheet: stylesheetRule,
});
