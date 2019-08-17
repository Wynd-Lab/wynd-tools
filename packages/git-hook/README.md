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

require('@wynd/git-hook').hook('pre-receive');
```

Or use your own hook:
```js
#!/usr/bin/env node

const gitHook = require('@wynd/git-hook');

class MyHook extends gitHook.Hook {
    run() { // Should be implemented
        console.log(this.oldRev, this.newRevn, this.refName); // you can get informations from the githook itself
    }
}
```

## Licence

MIT - see [LICENCE](./LICENCE)