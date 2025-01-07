import {RuleTester} from "@typescript-eslint/rule-tester";
import {createConfig} from "../create-config.js";
import {name, rule} from "../../src/rules/import-ordering.js";

const ruleTester = new RuleTester(createConfig());

ruleTester.run(name, rule, {
    valid: [
        `
        import React from "react";
        import {ObjectUtil} from "@pinnacle0/util";
        import AntButton from "antd/es/Button";
        import {SomethingUtil} from "../util/SomethingUtil";
        import type {ButtonProps} from "./type";
        `,
        `
        import React from "react";
        import {classNames} from "core-fe";
        import {actions as mainActions} from "module/main";
        import {SomethingUtil} from "../util/SomethingUtil";
        import type {SafeChild} from "@pinnacle0/util";
        import type {ButtonProps} from "./type";
        `,
    ],
    invalid: [
        {
            code: `
            import {Filter} from "./Filter";
            import "../index.less";
            import React from "react";
            import "antd/es/Drawer/css";
            `,
            errors: [{line: 2, messageId: "importOrdering"}],
            output: `
            import React from "react";
            import {Filter} from "./Filter";
            import "antd/es/Drawer/css";
            import "../index.less";
            `,
        },
        {
            code: `
            import {WithdrawalSuccess} from "./Main/WithdrawalSuccess";
            import React from "react"
            `,
            errors: [{line: 2, messageId: "importOrderingLast"}],
            output: `
            import React from "react"
            import {WithdrawalSuccess} from "./Main/WithdrawalSuccess";
            `,
        },
        {
            code: `
            import React from "react";
            import {Filter} from "./Filter";
            import "../index.less";
            import "antd/es/Drawer/css"
            `,
            errors: [{line: 4, messageId: "importOrderingLast"}],
            output: `
            import React from "react";
            import {Filter} from "./Filter";
            import "antd/es/Drawer/css"
            import "../index.less";
            `,
        },
        {
            code: `
            import {useDispatch} from "react-redux";
            import React from "react";
            import {Filter} from "./Filter";
            import type {SafeChild} from "@pinnacle0/util";
            import type {CSSProperties} from "react";
            import "../index.less";
            import "antd/es/Drawer/css";
            `,
            errors: [{line: 2, messageId: "importOrdering"}],
            output: `
            import React from "react";
            import {useDispatch} from "react-redux";
            import {Filter} from "./Filter";
            import type {CSSProperties} from "react";
            import type {SafeChild} from "@pinnacle0/util";
            import "antd/es/Drawer/css";
            import "../index.less";
            `,
        },
        {
            code: `
            import {DINAmount} from "@ub/web-shared/component/DINAmount";
            import {useSwipe} from "react-swipable";
            import React from "react";
            import {classNames} from "core-fe";
            import {Picker} from "component/Picker";
            import {useDispatch} from "react-redux";
            import {actions} from "../../index"
            import type {Filter} from "../../type"
            import {InputValidator} from "@ub/shared/src/InputValidator"
            import type {CSSProperties} from "react"
            `,
            errors: [{line: 2, messageId: "importOrdering"}],
            output: `
            import React from "react";
            import {useSwipe} from "react-swipable";
            import {useDispatch} from "react-redux";
            import {classNames} from "core-fe";
            import {DINAmount} from "@ub/web-shared/component/DINAmount";
            import {InputValidator} from "@ub/shared/src/InputValidator"
            import {Picker} from "component/Picker";
            import {actions} from "../../index"
            import type {CSSProperties} from "react"
            import type {Filter} from "../../type"
            `,
        },
    ],
});
