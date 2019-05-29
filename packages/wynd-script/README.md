# Wynd Script

List of various useful Javascript related scripts compiled in one repository.

## Usage
```sh
yarn add -D @wynd/wynd-script
# or
yarn --global add -D @wynd/wynd-script # deprecated
```

Then use the command as follow in you project root:
```sh
./node_modules/.bin/wsc
```
or through your package.json scripts with: `wsc <command> [options]`

## Options list

- `-p` or `--project`: [default: `./package.json`] - specify the package json file to use

## Command list

- `wsc diffTslint [./tslint.json]`: expose a diff between you tslint.json file and alors tslint config rules that your config extends. It helps for deduping and cleaning tslint config files.

- `wsc pub [--no-build] [--npm] [--public]`: publish your package on "@latest" npm tag relatively to your version. Make sure to be logged once with npm and yarn to your registry. If `--no-build` is specified, no `yarn build` command will be called. By default, yarn client will be used to publish, you can set `--npm` to use npm instead.  
:warning: In npm mode, when publishing a scoped package, npm will use `.npmrc` registry option before cli flag or `package.json` `publishConfig` object.  
In case of scopped package, you can also provide the `--public ` flag if you want to publish it with a public access.

- `wsc pub:dev [--no-build]`: like the command before but on "@next" npm tag. The version used is computed to be like `<your version patch bumped>-dev.x` (e.g. if your on version `1.0.0`, the next version will be `1.0.1-dev.0` then `dev.1` and so on).

- `wsc syncPeer`: it will modify your package json file to synchronize your peerDependencies with your devDependencies. It can be set to the `postinstall` and `postupdate` npm hooks.

- `wsc pack`: it will generate a "tgz" file for your module. For dev purposes, you should handle the "build" step by your. (e.g. if you need to build in debug mode)

- `wsc coverage`: reveal the coverage average (line, statements, functions, branches)
:warning: your coverageReporters must be setup with `json-summary`.

---

**:warning: Only for gitlab-ci usage.**
you have to declare in gitlab's var : `CI_API_URL`( gitlab api url ) and `GITLAB_API_READ_ONLY_TOKEN`( gitlab private access token ).
- `wsc compareCoverage [--ref] [--threshold]`: compare your current average from the last merge request average merged on `--ref` branch. `--ref` default value is `develop`. `--threshold` is the percent delta authorized between your ref branch and your current coverage. `--threshold` default value is 0.
:warning: your coverageReporters must be setup with `json-summary`.

## License

[MIT](./LICENSE)