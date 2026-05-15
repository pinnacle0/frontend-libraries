# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository overview

pnpm workspace monorepo of published `@pinnacle0/*` libraries used internally at Pinnacle. Node ≥ 24, pnpm 11, TypeScript 6, ESM-only. Source ships as `.ts`/`.tsx` (most packages' `exports` field points directly at `./src/index.ts`); consumers compile via their own bundler/tsc. The published artifact is typically built into `build/`, `dist/`, or `lib/` and uploaded by `prepublishOnly`.

## Workspace structure

Eight published packages under `packages/`:

- `util` — pure TS utilities (`ArrayUtil`, `DateUtil`, `EnumUtil`, …). No React. Exports from [packages/util/src/index.ts](packages/util/src/index.ts).
- `web-ui` — React 19 component library on top of Ant Design 6 (with `@ant-design/cssinjs`, `dayjs`, `rc-picker`). Less stylesheets are side-effectful. Sub-trees: `core/` (components), `admin/` (admin shell, e.g. `AdminApp`, `MainLayout`), `hooks/`, `util/`, `internal/` (private — do **not** import).
- `react-stack-router` — custom React router with native-app-style stack/screen transitions. Entry [packages/react-stack-router/src/createRouter.tsx](packages/react-stack-router/src/createRouter.tsx); `StackRouter` + `Route` model in `src/stackRouter/` and `src/route/`. Routes are declared as nested `<Route>` JSX children and walked by `createChildrenRoute`.
- `webpack-util` — opinionated build/dev pipeline around `@rspack/*` + webpack 5 (`Builder`, `ServerStarter`, `WebpackConfigGenerator`, `CodeStyleChecker`, `TestRunner`).
- `devtool-util` — shared internal build helpers (`TaskRunner`, `Utility`, `PrettierUtil`, `NamingUtil`, plus `ModuleGenerator`/`IconGenerator`/`APIGenerator`). Most other packages' `script/build.ts` is just `new TaskRunner("build").execute([...])` from here.
- `eslint-plugin` — custom ESLint rules (e.g. `module-class-lifecycle-order`, `react-component-method-ordering`, `no-deep-nested-relative-imports`) plus exported flat configs `baseline` and `vitest`. Has a `new-rule` scaffolder and a `codegen` step that regenerates the rules index — run it after adding a rule.
- `codemod` — CLI (`pinnacle-codemod` / `pmod`) of babel/recast codemods for migrating consumers of the other packages. Add new codemods via `pnpm new-codemod`, then `pnpm codegen` to refresh the registry.
- `pnpm-single-version` — CLI (`psv`) used by the root `postinstall` to enforce that packages listed under `pnpmSingleVersion.includes` in the root `package.json` (React, antd icons, eslint, etc.) resolve to exactly one version across the workspace.

## Commands

Run from repo root unless noted. The CI workflows in `.github/workflows/pkg-*-ci.yml` only invoke `pnpm install` then `pnpm --filter <pkg> run build` — `build` is the single source of truth for what must pass.

```bash
pnpm install                                    # also runs `psv check` via postinstall
pnpm --filter @pinnacle0/<pkg> run build        # full pipeline: lint + test + tsc + asset copy
pnpm --filter @pinnacle0/<pkg> run test         # vitest --run (one-shot, all tests)
pnpm --filter @pinnacle0/<pkg> run lint         # where defined
pnpm --filter @pinnacle0/<pkg> run format       # prettier --write
```

Per-package extras worth knowing:

- `web-ui`: `pnpm --filter @pinnacle0/web-ui run demo` (Vite dev server in `packages/web-ui/demo/`). Build also runs `stylelint` over `.less` files.
- `react-stack-router`: `pnpm --filter @pinnacle0/react-stack-router run demo`. Build is `tsc --build` + `cpy 'src/**/*.less' dist --parents` (no separate lint step in `package.json` — lint is enforced via the root config when running tsc/tests).
- `eslint-plugin`: `pnpm --filter @pinnacle0/eslint-plugin run new-rule` to scaffold, then `pnpm --filter @pinnacle0/eslint-plugin run codegen` to refresh the rules barrel.
- `codemod`: `pnpm --filter @pinnacle0/codemod run new-codemod`, then `pnpm --filter @pinnacle0/codemod run codegen`. The CLI itself is `pnpm --filter @pinnacle0/codemod run bin` during development.

Run a single vitest test:

```bash
pnpm --filter @pinnacle0/<pkg> exec vitest --config ./config/vitest.config.ts --run -t "<test name>"
# or by path
pnpm --filter @pinnacle0/<pkg> exec vitest --config ./config/vitest.config.ts --run test/path/to/file.test.ts
```

The vitest config is package-local at `config/vitest.config.ts` — every test invocation in this repo passes `--config` explicitly.

## Conventions and gotchas

- **ESM with explicit `.js` extensions in imports.** Source is `.ts` but imports specifiers end in `.js` (e.g. `import {ArrayUtil} from "./core/ArrayUtil.js"`). TS resolves this; runtime needs it. Don't strip the `.js`.
- **Prettier**: `printWidth: 200`, `tabWidth: 4`, `bracketSpacing: false`, `arrowParens: "avoid"`, `trailingComma: "es5"`. Indentation is 4 spaces across `.ts/.tsx/.css/.less/.js/.jsx`, with `.json/.yaml` also at 4. Don't reformat to defaults.
- **ESLint (root flat config in [eslint.config.js](eslint.config.js))** — applies repo-wide. Notable: `@typescript-eslint/consistent-type-imports` is on, `@typescript-eslint/explicit-member-accessibility` requires `no-public`, `no-console` allows only `info/warn/error`, `react/jsx-fragments` requires `<React.Fragment>` (element, not shorthand).
- **TypeScript** ([tsconfig.base.json](tsconfig.base.json)): `strict`, `exactOptionalPropertyTypes`, `noUnusedLocals`, `noUnusedParameters`, `noUncheckedSideEffectImports`. New code should hold to these.
- **Single-version dependencies**: changing the version of anything listed in root `pnpmSingleVersion.includes` (react, antd icons, eslint, `@typescript-eslint/*`, etc.) must be done consistently across all packages or `psv check` will fail at install. Root `pnpm-workspace.yaml` `overrides:` pins transitive versions; prefer adding to `overrides` rather than patching lockfiles.
- **Build pipeline shape**: most packages' `script/build.ts` uses `TaskRunner` from `@pinnacle0/devtool-util/TaskRunner` with `skipInFastMode` on the lint/test/style stages. Setting `FAST_MODE=true` skips them — only do this for inner-loop iteration, never for CI/publish.
- **web-ui consumer reminders** (from its README): import `@pinnacle0/web-ui/css/global.less` once at app entry; wrap with `<LocaleProvider>` for non-English; wrap with `<BrowserRouter>` if using `admin/MainLayout`; never import `@pinnacle0/web-ui/internal/*`.
- **react-stack-router** still depends on `react-router-dom@5.x` via `web-ui`'s peerDep — they coexist; the stack router replaces `react-router-dom`'s screen rendering, not its history primitives.
- **No top-level test runner.** There is no root `pnpm test`/`pnpm build` — always go through `pnpm --filter <pkg>`. CI mirrors this: one workflow per package, triggered by changes inside that package's directory.
- **Don't commit `build/`, `dist/`, `lib/`, `*.tsbuildinfo`.** These are gitignored but TS incremental builds drop `tsconfig.tsbuildinfo` inside package directories — leave them out of commits.
