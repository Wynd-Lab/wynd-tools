# Contributing

Congratulations, you are going to contribute to **Wynd tools**.
First of all, we want to thank you for spending time to improve this project 🙏!

## Table Of Contents

[Introduction](#introduction)

[How to contribute](#how-to-contribute)

* [Bugs](#bugs)
* [Features](#features)
* [Pull Requests](#pull-requests)

[Conventions](#conventions)

## <a id="introduction"></a>🏁 Introduction

The following guidelines ensure your contributions respect the project philosophy, design, conventions and rules.

This project and everyone participating in it is governed by the [Wynd Code of Conduct](/CODE_OF_CONDUCT.md). By participating, you are
expected to uphold this code. Please report unacceptable behavior to [the projects maintainers](mailto:wynd-lab@wynd.eu)

## <a id="how-to-contribute"></a>❓ How to contribute

### <a id="bugs"></a>🐛 Bugs

First, ensure your bug isn't listed in [issues](https://github.com/Wynd-Lab/wynd-tools/issues). It is better to contribute to an existing issue instead of creating a new one. It's really important that you respect a specific format for your bug reports. This provides an optimal reading for contributors and ease the implementation of fixes. Template is available [here](/.github/ISSUE_TEMPLATE/bug_report.md).

If a bug can be cover with an unit test, you are more than welcome to write it! It's one of the best way to quickly resolve the issue 👍

### <a id="features"></a>💡 Features

First, ensure your feature isn't listed in [issues](https://github.com/Wynd-Lab/wynd-tools/issues).

A feature must be created as a proposal for discussion with the Wynd maintainers. Like bugs, you must respect a specific format, a template is available [here](/.github/ISSUE_TEMPLATE/feature_request.md).


### <a id="pull-requests"></a>🎁 Pull Requests

First, you need to take a look at [Conventions](#conventions) to ensure your code respect project rules. These rules are mandatories to ensure each pull request respects the philosophy of the project.

#### Authorship

All commits must be made with your personnal **Github** account and signing commits if possible (Take a look at Github documentation to set your user [name](https://help.github.com/articles/setting-your-username-in-git/), [email](https://help.github.com/articles/setting-your-email-in-git/) & [GPG](https://help.github.com/articles/signing-commits-using-gpg/)).

#### Build project

To setup development dependencies:

```
$ yarn
```

Code analysis need to succeed because of the continious integration. You can run it with:

```
$ yarn lint
```

Code transpilation need to succeed because of the continious integration. You can run it with:

```
$ yarn build
```

> ⚠️ Always ensure lint and build succeeded before commit some code

#### Commit

- This project use [gitmoji](https://github.com/carloscuesta/gitmoji)
- For commit message, please:
    - Use the present tense ("Add feature" not "Added feature")
    - Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
    - Limit the first line to 50 characters or less

#### Rebase

Each pull request must be synchronized with remote repository. We recommand to use an interactive rebase to synchronize local and remote repositories.

Git command example:

```
$ git fetch
$ git rebase -i origin/develop
```

or

```
$ git pull --rebase
```

External contributors have to synchronize local repository with the forked one (Take a look at the Github documentation [here](https://help.github.com/articles/syncing-a-fork/)).

#### Branches

- This project use Gitflow naming convention.
- **Only** start an hotfix branch from `master` (or tagged version)
- No emoji (nor shortcode)
- camelCase

#### Github PR

If a Pull requests resolve an issue, include it inside the description. When approved by reviewers, pull request are merged into the "_master_" branch.

> ⚠️ To be reviewed, CI process must succeeded

## <a id="conventions"></a>Conventions

Please respect **linter** and **TypScript** configuration

> ⚠️ Pull request with configuration changes whitout valid reasons will be rejected.
