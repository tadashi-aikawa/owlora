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


Support repeated tasks
----------------------

- [x] every day(s)
- [ ] every other day(s)
- [x] every workday(s)
- [ ] every other workday(s)
- [ ] every 1st workday(s)
- [x] every monday(s)
- [x] every wednesday(s), friday(s)
- [x] every tue(s),sat(s), sun(s)
- [x] every other monday(s)
- [x] every other mon(s),wed(s),fri(s)
- [ ] every 1st mon(s), wed(s)
- [x] every 1,15
- [ ] every 3day(s)
- [ ] ending 7-25

* It is going to be supported that not marked
* It is also be supported that case sensitive


For developer
-------------

Only support for Linux (Not support for windows and mac)


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
$ make dev
```


### Show storybook

```
$ make storybook
```


### Structual test (Recommended to run by both human and CI)

```
$ make structual-test
```

If results are expected, you run...

```
$ make structual-test-update
```


### Visualzed test

#### Requirements

If you use Makefile

* Docker
* Set `WEBHOOK_URL` and `BUCKET_NAME`
* Set aws credentials to access s3 bucket (ex. `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`)

#### Optionals

* Set `DOCKER_PREFIX` (ex. set `DOCKER_PREFIX=root`if you want to run `sudo docker` instead of `docker`)

#### Local test after topic branch is committed locally...

```
$ npm run build-storybook visualized-test
```

#### After PR is created... (**Optional**)

```
$ make visualized-test-init visualized-test
```

#### After master is committed... (**Required**)

```
$ make visualized-test-init visualized-test-quietly
```


### Build

```
$ npm build
```


### Release

Before release, you need to `Confirm that your branch name equals release version`

```
$ make release
```

Finally, create pull request and merge to master!!

