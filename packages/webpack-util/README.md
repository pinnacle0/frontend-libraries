This project is to provide two helpers, based on `webpack`:
 - WebpackServerStarter: start a frontend project in localhost
 - WebpackBuilder: bundle a frontend project
 
We follow the rule: `Convention Over Configuration`.
Therefore, the only required option is **the project path**, with following content. 

## Project Tech Stack Requirement

- TypeScript/JavaScript
- CSS/LESS
- eslint
- stylelint
- prettier

## Project Folder Structure

- /build (for output use, will be over-written after build)
- /src
  - index.html
  - index.ts/tsx/js/jsx/less/css (as chunk entry)
- /static
- package.json
- tsconfig.json

```
Following files also required, but can exist in upper folder:
- eslint config 
- stylelint config
- prettier config 
```

## Dependency versions status

- autoprefixer  # Lock at 9.8.6 (stylelint uses <10.0.0)
- css-loader  # Lock at 4.3.0 (5.0.0 uses postcss8)
- html-webpack-plugin  # Lock at 4.4.1 (4.5.0 adds webpack5 auto publicPath option)
- mini-css-extract-plugin  # Lock at 0.12.0 (default esModule=true)
- postcss  # Lock at 7.0.35 (stylelint uses <8.0.0)
- script-ext-html-webpack-plugin  # No changelog
- style-loader  # Lock at 1.3.0 (default esModule=true)
- terser-webpack-plugin  # Lock at 4.2.3 (5.0.0 drops webpack4 support)
