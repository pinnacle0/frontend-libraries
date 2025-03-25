# pnpm single version

Enforce Single version of dependencies on pnpm workspace.

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Installation

```bash
pnpm add -D pnpm-single-version
```

## Usage

Add following options to `package.json` in project root

```json5
"pnpmSingleVersion": {
    "includes": [
        // Place all the single version dependencies here
        "@babel/core",
        "esbuild",
        // glob is also supported
        "eslint-plugin-*",
        "*-plugin",
    ]
}
```

### Maunal Checking using CLI

You can `pnpm-single-version` in Terminal

```bash
pnpm pnpm-single-version
```

or

```bash
pnpm psv
```

### Automatic resolve (Recommanded)

Apart from manual checking, checking can also be done when `pnpm-lock.yaml` is resolved, where pnpm detected dependencies changes running `pnpm install` , `pnpm update` and `pnpm removed`. This is much effective.

By using `afterAllResolved` hook in `.pnpmfile.cjs`, installation process can be interrupted when non-single version dependencies is detected.

To setup it up,

1. First, install checker via

    ```shell
    pnpm pnpm-single-version install
    ```

    this command will generate a checker file inside `.psv` directory of the root directory of workspace.

2. Then you should create a `.pnpmfile.cjs` and add following code

    ```js
    const hook = require("./.psv/hook");

    module.exports = {
        hooks: {
            afterAllResolved: hook,
        },
    };
    ```

Now, when you call `pnpm install` and `pnpm update`, checking is going to be involve automatically only when have dependenices changes.

**PS: You may need to run `psv install` every time you update `pnpm-single-version`**

More about `.pnpmfile.cjs` at https://pnpm.io/pnpmfile
