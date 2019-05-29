# tslint-config-wynd

Lint rules for Wydn front-end Typescript development

## Usage
Be aware that `tslint-config-wynd` has peer dependencies on TSLint and Typescript ; also it uses Prettier, [tslint-config-prettier](https://github.com/alexjoverm/tslint-config-prettier) to disable conflictual rules with Prettier, and [tslint-plugin-prettier](https://github.com/ikatyang/tslint-plugin-prettier) to make Prettier run during check or fix from TSLint.

First, you need to install the package:
```sh
yarn add -D @wynd/tslint-config-wynd
```
Then add the config to your `tslint.json`: 
```json
{
    "extends": [
        "@wynd/tslint-config-wynd"
    ]
}
```
or if you want to use React rules:
```json
{
    "extends": [
        "@wynd/tslint-config-wynd/react"
    ]
}
```

## Rules
Rules from `tslint` latest and [`tslint-config-airbnb`](https://github.com/progre/tslint-config-airbnb) are used.  
But some of them are overrided:

### `prettier`
Prettier is set up to fix your code alongside tslint without any conflct.  
With VSCode, you can set up "onSave" config like this:
```json
{
    "files.autoSave": "onFocusChange",
    "tslint.autoFixOnSave": true,
    "tslint.run": "onType"
}
```

Some rules are purely handled by prettier:
```json
{
    "tabWidth": 4,
    "trailingComma": "all",
    "singleQuote": true,
    "printWidth": 120
}
```

### Other rules
- `quotemark`
    - Enforce to use single quote in classic code, to do not use template string if not nescessary, and to allow double-quote if escaping quote is implied or if your in jsx format
- `interface-name`
    - Interface can be named as wanted because some interface are used as type.
- `semicolon`
    - Semicolon are ignored in interface and bound class methods to avoid conflict with prettier.
- `indent`
    - To make it even more strict with `.editorconfig` file, indentation should be with spaces rather than tabs
- `member-ordering`
    - Enforce member ordering like to be the same in any classes:

```typescript
class Foo {
    private static p1;
    protected static p2;
    public static p3;

    private p4;
    protected p5;
    public p6;

    private constructor() {}
    protected constructor() {}
    constructor() {} // public can be omitted for constructor

    private static fn1() {}
    protected static fn2() {}
    public static fn3() {}

    private fn4() {}
    protected fn5() {}
    public fn6() {}
}
```
- `no-namespace`
    - Allow usage of namespace
- `no-string-literal`
    - Allow usage of string literal

```typescript
// For example, setting up some variable explicitly to window object should no longer be impossible
window['foo'] = 'bar';
```
- `variable-name`
    - Make variable naming to be less painful
- `no-empty`
    - Allow empty blocks
- `one-variable-per-declaration`
    - Disable restriction for variable declaration
- `forin`
    - Allow usage of `for (const i in arr)`
- `no-var-require`
    - Allow usage of `const react = require('react')`
- `max-classes-per-file`
    - Disable limit of class declaration per file
- `no-implicit-dependencies`
    - Allow usage and import of depDependencies
- `no-trailing-whitespace`
    - Enforce removing of trailing whitespace except in comment block (for markdown)
- `no-submodule-imports`
    - Allow usage of submodules like in underscore or moment lib
- `no-unused-expression`
    - Allow usage of short code like `expression && fn()` in one line
- `no-increment-decrement`
    - Allow usage of `++` and `--`
- `function-name`
    - Make function naming less painful
- `import-name`
    - Make import naming less painful
- `no-parameter-reassignment`
    - Allow reassignment of parameter in function
- `prefer-array-literal`
    - Avoid conflict with other rule for array declaration
- `no-default-export`
    - Unallow usage of `default` keyword during export. You should instead use `allowSyntheticDefaultImports` and `esModuleInterop` in your tsconfig compiler configuration.
- `[no-unused-variable](https://palantir.github.io/tslint/rules/no-unused-variable/)`
    - (deprecated since TypeScript 2.9) Disallows unused imports, variables, functions and private class members. Similar to tsc’s –noUnusedParameters and –noUnusedLocals options, but does not interrupt code compilation.
- `object-literal-sort-keys`
    - Add "shorthand-first" parameter to disable conflict with `object-shorthand-properties-first` rule
- `ban-ts-ignore`
    - We should **never** use `// @ts-ignore`

### React Rules
They are the same as describe before plus [tslint-react](https://github.com/palantir/tslint-react), with a slight difference :
- `[jsx-boolean-value](https://github.com/palantir/tslint-react#rules)`
    - When using a boolean attribute in JSX, you can set the attribute value to `{true}` or omit the value. This setting enforces the latter case.
- `[jsx-no-multiline-js](https://github.com/palantir/tslint-react#rules)`
    - This rule is disabled to allow multiline JS expressions inside JSX blocks

## License

[MIT](./LICENSE)
