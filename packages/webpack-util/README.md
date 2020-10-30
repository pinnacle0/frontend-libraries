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
