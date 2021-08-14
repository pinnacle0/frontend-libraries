// -----------------------------------------------------------------------------
//      Attention: This file is generated by "yarn export-rules-and-config"
//                           Do not modify by hand
//              Run "yarn export-rules" to regenerate this file
// -----------------------------------------------------------------------------

import type {RuleListener, RuleModule} from "@typescript-eslint/experimental-utils/dist/ts-eslint";
import {rule as moduleClassLifecycleOrder} from "./module-class-lifecycle-order";
import {rule as moduleClassMethodDecorators} from "./module-class-method-decorators";
import {rule as reactComponentDefaultPropsTyping} from "./react-component-default-props-typing";
import {rule as reactComponentDisplayName} from "./react-component-display-name";
import {rule as reactComponentEventHandlerNaming} from "./react-component-event-handler-naming";
import {rule as reactComponentMethodOrdering} from "./react-component-method-ordering";
import {rule as reactComponentPropsTyping} from "./react-component-props-typing";
import {rule as reactComponentStateMember} from "./react-component-state-member";
import {rule as noNamedImports} from "./no-named-imports";
import {rule as noDeepNestedRelativeImports} from "./no-deep-nested-relative-imports";
import {rule as noUglyRelativePath} from "./no-ugly-relative-path";
import {rule as noUnnecessaryEndingIndex} from "./no-unnecessary-ending-index";
import {rule as stylePropertiesType} from "./style-properties-type";
import {rule as importOrdering} from "./import-ordering";
import {rule as explicitModuleClassMethodReturnType} from "./explicit-module-class-method-return-type";
import {rule as variableDeclarationModuleIdentifierShadowing} from "./variable-declaration-module-identifier-shadowing";

export const rules: Record<string, RuleModule<string, any[], RuleListener>> = {
    "module-class-lifecycle-order": moduleClassLifecycleOrder,
    "module-class-method-decorators": moduleClassMethodDecorators,
    "import-ordering": importOrdering,
    "react-component-default-props-typing": reactComponentDefaultPropsTyping,
    "react-component-display-name": reactComponentDisplayName,
    "react-component-event-handler-naming": reactComponentEventHandlerNaming,
    "react-component-method-ordering": reactComponentMethodOrdering,
    "react-component-props-typing": reactComponentPropsTyping,
    "react-component-state-member": reactComponentStateMember,
    "no-ugly-relative-path": noUglyRelativePath,
    "no-unnecessary-ending-index": noUnnecessaryEndingIndex,
    "no-named-imports": noNamedImports,
    "no-deep-nested-relative-imports": noDeepNestedRelativeImports,
    "explicit-module-class-method-return-type": explicitModuleClassMethodReturnType,
    "style-properties-type": stylePropertiesType,
    "variable-declaration-module-identifier-shadowing": variableDeclarationModuleIdentifierShadowing,
};
