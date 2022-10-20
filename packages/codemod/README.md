# @pinnacle0/codemod

This package provide various codemod to refactor code related to other pinnacle published packages.

Codemod does not guarantee 100% accuracy, please double check your source file after transform.

## Installation

```shell
npm install -g @pinnacle0/codemod
```

or to install locally in order to use JavaScript API provided by use

```shell
pnpm add -D @pinnacle0/codemod
```

## Usages

There to two way to execute the code: using command line and through JavaScript API

### CLI usage

```bash
# list all avaliable codemod
pinnacle-codemod list
# Transform file, add --dry flat to dry-run
pinnacle-codemod transform <codemod> <path> 
# Help for advanced usage
pinnacle-codemod --help
```

 It is recommanded to run transform with `--dry` flag first to make sure there are going to be no error during transform.

### API usage

```typescript
import { run } from '@pinnacle0/codemod'

// eg:
run('select-your-code-mod', './src/**/*.ts' , { dry: true });
```

## Development

use `new-codemod` script to generate new template for creating the new codemod.

use `codgen` script to auto update the codemod list and type.

### Core

`@babel/parser` is used to parse the source code to AST, and use `recast` to travel and transform the tree node. 

The main reason of using `recast` instead of  `@babel/travse` and `@babel/generator`  is the former tries to preserve the style of original code as much as possible wherer later do not.

## Known issues

- Unable to preserve code style of JSX 

- Parse HTML entities incorrectly

## License

MIT
