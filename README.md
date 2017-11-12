Owlora
======

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

<img src="./owlora.png" />

Task management tool in which can medium term.

For now, `Owlora` uses Todoist API as backend.


Support platforms
-----------------

* Google chrome (Not for all)
* Firefox (Not for all)


Demo
----

If you have todoist and google accounts, you can trying [Demo](https://owlora-mamansoft.firebaseapp.com/). 

* Todoist token is used to use todoist sync api
* Google account is used to synchronize configurations which in server(firebase) and client(browser) 


For developer
-------------

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

### Structual test (Recommended to run by both human and CI)

```
$ npm test
```

If results are expected, you run...

```
$ npm test -- -u
```

### Build

```
$ npm build
```


CI
==

### Release

TODO: refactor

1. Increment version in `package.json`
2. `npm run release`

### Visualzed test

#### Requirements

* Linux (Not support for windows and mac)
* Docker
* Set `WEBHOOK_URL` and `BUCKET_NAME`
* Set aws credentials to access s3 bucket (ex. `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`)

#### Optionals

* Set `DOCKER_PREFIX` (ex. set `DOCKER_PREFIX=root`if you want to run `sudo docker` instead of `docker`)

#### Local test after topic branch is committed locally...

```
$ make visualized-test-init visualized-test-quietly
```

#### After PR is created... (**Optional**)

```
$ make visualized-test-init visualized-test
```

#### After master is committed... (**Required**)

```
$ make visualized-test-init visualized-test-quietly
```

