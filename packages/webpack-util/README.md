# `@pinnacle0/webpack-util`

This project is to provide two helpers, based on `webpack`:

Following `Convention Over Configuration`,
we provide two all-in-one tools for webpack development and build.

## `WebpackServerStarter`

```ts
new WebpackServerStarter({
    projectDirectory: path.join(__dirname, ".."),
    port: 1234,
}).run();
```

-   Creates a `webpack` compiler instance (development mode) and runs it with `webpack-dev-server`.
-   Starts a `localhost` https server in `1234` port.

## `WebpackBuilder`

```ts
new WebpackBuilder({
    projectDirectory: path.join(__dirname, ".."),
}).run();
```

-   Checks if the project structure complies to convention described below.
-   Optional `rootDirectory` key can be included in monorepo projects. This is used to check if [`canadyarn`](https://www.npmjs.com/package/canadyarn) script exists in root's `package.json` and check if specified dependencies have single resolved version in `yarn.lock`.
-   Checks if source files complies with project `prettier` / `stylelint` / `eslint` rules.
-   Run test if supported by `package.json` scripts.
-   Creates a `webpack` compiler instance (production mode) and bundle into an `index.html` with related CSS/JS/images etc.

## Project Tech Stack Requirement

-   yarn
-   TypeScript/JavaScript
-   CSS/LESS
-   eslint
-   stylelint
-   prettier

Note: CSS/LESS only website also supported, without any JavaScript.

## Project Folder Structure

The following structure can be used for a basic project setup.

```text
<projectDirectory>
├── build/
│   └── dist/
│           (Output directory for build artifacts, content will be
│            overwritten by each build, should be ignored by git)
├── src/
│   ├── index.html
│   │       (HTML entry)
│   └── index.{ts,tsx,js,jsx,less,css}
│           (Main entry)
├── static/
│           (Directory to serve static files, e.g: robots.txt)
├── tsconfig.json
│           (TypeScript config)
├── .eslintrc.js
│           (ESLint config, can be moved to upper directories)
├── prettier.config.js
│           (Prettier config, can be moved to upper directories)
├── stylelint.config.js
│           (Stylelint config, can be moved to upper directories)
└── package.json
            (Project manifest file)
```

## Monorepo Folder Structure

The following structure can be used for a yarn workspace monorepo setup.

```text
<workspaceRootDirectory>
├── packages/
│   ├── project1/
│   │   ├── build/dist/
│   │   ├── config/
│   │   │   ├── tsconfig.script.json (extends: "../../../tsconfig.base.json", ...)
│   │   │   ├── tsconfig.src.json    (extends: "../../../tsconfig.base.json", ...)
│   │   │   └── tsconfig.test.json   (extends: "../../../tsconfig.base.json", ...)
│   │   ├── script/
│   │   │   ├── build.ts
│   │   │   └── start.ts
│   │   ├── src/
│   │   │   ├── index.html
│   │   │   └── index.{ts,tsx,js,jsx,less,css}
│   │   ├── static/
│   │   ├── tsconfig.json (files: [], references: [{path: "config/tsconfig.src.json"}, ...])
│   │   └── package.json
│   └── project2/
│       ├── build/dist/
│       ├── config/
│       │   ├── tsconfig.script.json (extends: "../../../tsconfig.base.json", ...)
│       │   ├── tsconfig.src.json    (extends: "../../../tsconfig.base.json", ...)
│       │   └── tsconfig.test.json   (extends: "../../../tsconfig.base.json", ...)
│       ├── script/
│       │   ├── build.ts
│       │   └── start.ts
│       ├── src/
│       │   ├── index.html
│       │   └── index.{ts,tsx,js,jsx,less,css}
│       ├── static/
│       ├── tsconfig.json (files: [], references: [{path: "config/tsconfig.src.json"}, ...])
│       └── package.json
├── tsconfig.base.json    (Define common options to be extended by other tsconfig files)
├── .eslintrc.js
├── prettier.config.js
├── stylelint.config.js
└── package.json          (Yarn workspace manifest file)
```
