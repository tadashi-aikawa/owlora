# Owlora

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

<img src="./owlora.png" />

Task management tool in which can medium term.

For now, `Owlora` uses Todoist API as backend.

## Support platforms

* Google chrome (Not for all)
* Firefox (Not for all)

## Demo

If you have todoist and google accounts, you can trying [Demo](https://owlora-mamansoft.firebaseapp.com/). 

* Todoist token is used to use todoist sync api
* Google account is used to synchronize configurations which in server(firebase) and client(browser) 

## For developer

### Optional

```
$ yarn global add webpack
```

If you want to release..

```
$ npm install -g firebase-tools
$ firebase login
```

### Install dependencies

```
$ yarn install
```

### Debug

```
$ yarn dev
```

### Show storybook

```
$ yarn storybook
```

### Test

```
$ yarn test
```

or

```
$ yarn test:watch
```

### Build

```
$ yarn build
```

### Release

1. Increment version in `package.json`
2. `yarn release`
 
