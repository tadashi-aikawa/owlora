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

If you want to release..

```
$ npx firebase login
```

### Install dependencies

```
$ npm i
```

### Debug

```
$ npm run dev
```

### Show storybook

```
$ npm run storybook
```

### Structual test

```
$ npm test
```

If results are expected, you run...

```
$ npm test -- -u
```

### Visualzed test

First, you make `regconfig.json` like following.

```json
{
  "core": {
    "workingDir": ".reg",
    "actualDir": ".captures",
    "threshold": 0
  },
  "plugins": {
    "reg-keygen-git-hash-plugin": true,
    "reg-notify-slack-plugin": {
      "webhookUrl": "https://hooks.slack.com/services/XXXXXXXXXXXXXXXXXX/yyyyyyyyyyyyyyyyyy"
    },
    "reg-publish-s3-plugin": {
      "bucketName": "reg-publish-bucket-aaaa-bbbb-cccc-dddd-eeee-ffff"
    }
  }
}
```

And run

```
$ npm run visualized-test
```

### Build

```
$ npm build
```

### Release

1. Increment version in `package.json`
2. `npm run release`
 
