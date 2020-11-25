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

- Creates a `webpack` compiler instance (development mode) and runs it with `webpack-dev-server`.
- Starts a `localhost` https server in `1234` port.

## `WebpackBuilder`

```ts
new WebpackBuilder({
    projectDirectory: path.join(__dirname, ".."),
}).run();
```

- Checks if the project structure complies to convention described below.
- Checks if source files complies with project `prettier` / `stylelint` / `eslint` rules.
- Creates a `webpack` compiler instance (production mode) and bundle into an `index.html` with related CSS/JS/images etc.

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
-   `autoprefixer` # Lock at 9.8.6 (autoprefixer 10.0.0 uses postcss8)
-   `css-loader` # Lock at 4.3.0 (5.0.0 uses postcss8)
-   `mini-css-extract-plugin` # Lock at 0.12.0 (default esModule=true)
-   `postcss` # Lock at 7.0.35 (stylelint uses <8.0.0)
-   `script-ext-html-webpack-plugin` # No changelog
-->
