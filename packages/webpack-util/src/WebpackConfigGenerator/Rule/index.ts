import {imageRule} from "./image.rule.js";
import {otherRule} from "./other.rule.js";
import {stylesheetRule} from "./stylesheet.rule.js";
import {tsRule} from "./ts.rule.js";

/**
 * Static factories to create `webpack.config#modules.rules` items.
 */
export class Rule {
    static readonly image = imageRule;
    static readonly ts = tsRule;
    static readonly stylesheet = stylesheetRule;
    static readonly other = otherRule;
}
