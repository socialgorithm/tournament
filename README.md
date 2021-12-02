# Socialgorithm Core Monorepo

An monorepo containing the Socialgorithm data model and tournament server, used for running competitions.

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

### Increment version

```
npm run version
```

This will prompt you to choose the type of the next version (e.g. patch, minor, major)

### Publishing NPM package

```
npm run publish
```

This will publish to the latest tag in NPM.

You can also publish a prerelease tag to test changes:

```
npm run publish:prerelease
```
