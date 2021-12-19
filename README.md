# Socialgorithm Server

An monorepo containing the Socialgorithm data model, tournament server and UI, used for running competitions.

Usage Guides:
* [Model](packages/model/README.md)
* [Tournament Server](packages/tournament-server/README.md)

## Developer Guide

### Add dependencies

Add a dependency using lerna

```
npx lerna add <package> --scope=<package>
```

e.g. 

```
npx lerna add @socialgorithm/model --scope=@socialgorithm/tournament-server
```

### Install dependencies

```
npm run bootstrap
```

### Build and Test

```
npm run build
npm run test
```

### Publishing packages

#### From Github Actions

If you are releasing a patch version (no breaking changes), simply trigger the [Create patch and publish to NPM](https://github.com/socialgorithm/server/actions/workflows/npm-patch-publish.yml) Github actions workflow.

#### From command line

Increment the version:
```
npm run version:prompt
```

This will prompt you to choose the type of the next version (e.g. patch, minor, major)

Publish the new package:
```
npm run publish
```

This will publish the version in NPM.

You can also publish a prerelease tag to test changes:

```
npm run publish:prerelease
```
