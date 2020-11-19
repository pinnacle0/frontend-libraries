# `@pinnacle0/webpack-util`

This project is to provide two helpers, based on `webpack`:

WebpackUtil favours convention Over configuration.  
And many tools are intentionally made not configurable.

## `WebpackServerStarter`

Starts a frontend project in localhost.

```ts
// projectDirectory/script/start.ts
import {WebpackServerStarter} from "@pinnacle0/webpack-util";
import * as path from "path";
new WebpackServerStarter({
    apiProxy: null,
    projectDirectory: path.join(__dirname, ".."),
    port: 1234,
});
```

-   Creates a `webpack` compiler instance and runs it with `webpack-dev-server`.
-   Does not check project structure, code formatting, linting.

## `WebpackBuilder`

Bundles a frontend project.

```ts
// projectDirectory/script/build.ts
import {WebpackBuilder} from "@pinnacle0/webpack-util";
import * as path from "path";
new WebpackBuilder({
    projectDirectory: path.join(__dirname, ".."),
});
```

-   Checks if the project structure complies to convention described below.
-   Checks if source files complies with formatter and linters settings.
-   Creates a `webpack` compiler instance and performs a production build.

## Project Tech Stack Requirement

-   TypeScript/JavaScript
-   CSS/LESS
-   eslint
-   stylelint
-   prettier

## Project Folder Structure

The most basic setup should looks like this:

```text
projectDirectory/
├── build/
│   └── dist/
│           (Output directory for build artifacts, will be overwritten)
├── src/
│   ├── index.html
│   │       (Template file used by HtmlWebpackPlugin)
│   └── index.{ts,tsx,js,jsx,less,css}
│           (Entry file to produce the main webpack chunk)
├── static/
│           (Directory to serve static files)
├── tsconfig.json
│           (Typescript config file)
├── .eslintrc.js
│           (ESLint config file, can be moved to upper directories)
├── prettier.config.js
│           (Prettier config file, can be moved to upper directories)
├── stylelint.config.js
│           (Stylelint config file, can be moved to upper directories)
└── package.json
            (Project manifest file)
```

For a monorepo setup using yarn workspaces, the directory structure could be:

```text
projectRootDirectory/
├── web-shared/
│   └── src/
│       ├── tsconfig.json
│       └── package.json
│           (Project manifest file for web-shared)
├── web-project1/
│   ├── build/
│   │   └── dist/
│   ├── src/
│   │   ├── index.html
│   │   └── index.{ts,tsx,js,jsx,less,css}
│   ├── static/
│   ├── tsconfig.json
│   └── package.json
│           (Project manifest file for web-project1)
├── web-project2/
│   ├── build/
│   │   └── dist/
│   ├── src/
│   │   ├── index.html
│   │   └── index.{ts,tsx,js,jsx,less,css}
│   ├── static/
│   ├── tsconfig.json
│   └── package.json
│           (Project manifest file for web-project2)
├── .eslintrc.js
├── prettier.config.js
├── stylelint.config.js
└── package.json
            (Workspace manifest file)
            (https://classic.yarnpkg.com/en/docs/workspaces/)
```

<!--
## Webpack dependency versions status

-   `webpack` # Lock at 4.44.2 (wait for loaders & plugins patches)
-   `autoprefixer` # Lock at 9.8.6 (stylelint uses <10.0.0)
-   `css-loader` # Lock at 4.3.0 (5.0.0 uses postcss8)
-   `html-webpack-plugin` # Lock at 4.4.1 (4.5.0 adds webpack5 auto publicPath option)
-   `mini-css-extract-plugin` # Lock at 0.12.0 (default esModule=true)
-   `postcss` # Lock at 7.0.35 (stylelint uses <8.0.0)
-   `script-ext-html-webpack-plugin` # No changelog
-   `style-loader` # Lock at 1.3.0 (default esModule=true)
-   `terser-webpack-plugin` # Lock at 4.2.3 (5.0.0 drops webpack4 support)
-->
