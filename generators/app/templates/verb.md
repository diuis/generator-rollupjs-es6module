# {%= name %}

current version is: {%= version %}

## Install

This project uses [node](http://nodejs.org) and [yarn](https://yarnpkg.com). Go check them out if you don't have them locally installed.

GitHub [Hub](https://github.com/github/hub) is highly recommended: for example, it's possible to open pull request from command line.

```sh
$ yarn add luxdeepblue/{%= name %}#v{%= version %}
```

## build

```sh
$ yarn build
```

## start and watch

```sh
$ yarn start
```

## publish a new module release

- open a pull request from the feature branch to the master branch:
> message must starts with _patch:_, _minor:_ or _major:_
```sh
$ hub pull-request -m "minor: test message"
```

- if the pull request is approved, circleci will publish a new module version on github 'npm repository'
