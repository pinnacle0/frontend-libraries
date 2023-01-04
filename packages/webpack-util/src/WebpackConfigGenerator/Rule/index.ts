import {imageRule} from "./image.rule";
import {otherRule} from "./other.rule";
import {stylesheetRule} from "./stylesheet.rule";
import {tsRule} from "./ts.rule";

/**
 * Static factories to create `webpack.config#modules.rules` items.
 */
export class Rule {
    static readonly image = imageRule;

    static readonly other = otherRule;

    static readonly ts = tsRule;

    static readonly stylesheet = stylesheetRule;
}
