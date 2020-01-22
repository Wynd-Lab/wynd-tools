# Wynd Hook

ServerSide and ClientSide hooks that can be set through node to handle git hook for various operations.

## Install

You can install the wynd-hook locally but the best is to install it globally:
```sh
yarn global add @wynd/git-hook

# or

npm --global install @wynd/git-hook
```

## Usage

Go to your hook folder (`<myproject>/.git/hooks/`) then add a new hook file depending of your need (or edit the sample provided by git).
For example purpose, we will consider that `pre-receive` hook will be set.

Edit `.git/hooks/pre-receive` and make it executable.

Then use a pre defined hook:
```js
#!/usr/bin/env node

require('@wynd/git-hook').default('pre-receive', {
    commitAuthorEmailDomain: 'yourdomain.com'
    validPattern: /^refs\/heads\/[-a-z0-9_.\/]+$/,
    validPrefixes: [
        /^refs\/heads\/develop$/,
        /^refs\/heads\/master$/,
        /^refs\/heads\/feature\/.+/,
        /^refs\/heads\/hotfix\/.+/,
        /^refs\/heads\/release\/.+/,
        /^refs\/heads\/archi\/.+/,
        /^refs\/heads\/test\/.+/,
        /^refs\/heads\/ci\/.+/,
    ],
});
```

Or use your own hook:
```js
#!/usr/bin/env node

const gitHook = require('@wynd/git-hook');

class MyHook extends gitHook.Hook {
    run() { // Should be implemented
        console.log(this.oldRev, this.newRevn, this.refName); // you can get informations from the githook itself
        throw new gitHook.HookException('Validation failed'); // in case of validation error (will be catched)
    }
}

gitHook.hook(MyHook, {
    // config goes here and can be accessed through this.config
})
```

## Licence

MIT - see [LICENCE](./LICENCE)