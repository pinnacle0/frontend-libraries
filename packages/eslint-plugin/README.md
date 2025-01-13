# @pinnacle0/eslint-plugin

This package provides customized eslint rules for Pinnacle and a baseline config for react/typescript projects.

## Usage

This package includes a config which wraps multiple other eslint plugins and presets.

For our config to work properly, `@pinnacle0/eslint-plugin` has to be installed along with
all these plugins and presets ("peer dependencies").

1.  Install @pinnacle0/eslint-plugin and the required peer dependencies:

    ```sh
    $ pnpm install --dev \
      @pinnacle/eslint-plugin \
      eslint \
      @typescript-eslint/parser \
      @typescript-eslint/eslint-plugin \
      eslint-config-biome \
      eslint-plugin-react \
      eslint-plugin-react-hooks \
      eslint-plugin-import \
      eslint-plugin-eslint-comments

    ```

2.  Create `.eslintrc.js` at the project root directory:

    ```js
    module.exports = {
        extends: ["plugin:@pinnacle0/baseline"],
    };
    ```

3.  Add `lint` script to `package.json`:

    ```jsonc
    {
        // ...
        "scripts": {
            // ...
            "lint": "eslint --ext .js,.jsx,.ts,.tsx ."
        }
    }
    ```

4.  Run linter:
    ```sh
    $ pnpm lint
    ```

## Upgrading

It is recommended to use the latest version of all packages.

1. To upgrade, run (use arrow keys and space to select packages):

    ```sh
    $ pnpm up -iLr
    ```

2. Commit your changes:

    ```sh
    $ git commit -am "Upgraded dependencies"
    ```

3. Review the changes of `pnpm-lock.yaml` if they make sense, then commit your changes:
    ```sh
    $ git commit -a --amend --no-edit
    ```
