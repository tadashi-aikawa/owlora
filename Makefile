MAKEFLAGS += --warn-undefined-variables
SHELL := /bin/bash
.SHELLFLAGS := -eu -o pipefail -c
.DEFAULT_GOAL := help

.PHONY: $(shell egrep -oh ^[a-zA-Z_-]+: $(MAKEFILE_LIST) | sed 's/://')

help: ## Print this help
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z0-9_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

-include .env
version := $(shell git rev-parse --abbrev-ref HEAD)

#----

DOCKER_PREFIX ?=
DOCKER_IMAGE ?= tadashi-aikawa/owlora

GIT_BRANCH := $(shell git rev-parse --abbrev-ref HEAD)
GIT_HASH := $(shell git rev-parse HEAD)

SLACK_USER ?= "Owlora"
SLACK_CHANNEL ?= ""
SLACK_MESSAGE := ":tio: `$(GIT_BRANCH)` :tio:\n　:frame_with_picture: <https://$(BUCKET_NAME).s3.amazonaws.com/$(GIT_HASH)/index.html|Visualized test report>"
SLACK_ICON_URL ?= "https://github.com/tadashi-aikawa/owlora/raw/master/owlora.png"

define notify-slack
	curl -s -X POST -H 'Content-type: application/json' \
	  --data '{ \
	            "username": $(1), \
	            "channel": $(2), \
	            "text": $(3), \
	            "icon_url": $(4) \
	          }' \
	$(5)
endef

define run-npm-command
	$(DOCKER_PREFIX) docker run --rm \
	  -e AWS_ACCESS_KEY_ID=$(AWS_ACCESS_KEY_ID) \
	  -e AWS_SECRET_ACCESS_KEY=$(AWS_SECRET_ACCESS_KEY) \
	  -t $(DOCKER_IMAGE) \
	  npm run $(1)
endef


dev: ## Debug
	npm run dev

storybook: ## Run storybook
	npm run storybook

test: ## Unit test
	npm run test

build-image: ## Build docker image
	@echo 'Starting $@'
	$(DOCKER_PREFIX) docker build -t $(DOCKER_IMAGE) .
	@echo 'Finished $@'

visualized-test-init: ## Preparation of visualized-test. Need to set `WEBHOOK_URL` and `BUCKET_NAME`.
	@echo 'Starting $@'
	@cat templates/regconfig-tmp.json | sed -e "s@---WEBHOOK_URL---@$(WEBHOOK_URL)@g" -e "s@---BUCKET_NAME---@$(BUCKET_NAME)@g" > regconfig.json
	@echo 'Finished $@'

visualized-test: build-image ## Visualized test. Need to set `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.
	@echo 'Staring $@'
	@$(call run-npm-command,visualized-test)
	@$(call notify-slack,$(SLACK_USER),$(SLACK_CHANNEL),$(SLACK_MESSAGE),$(SLACK_ICON_URL),$(WEBHOOK_URL))
	@echo 'Finished $@'

visualized-test-quietly: build-image ## Visualized test without notification. Need to set `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.
	@echo 'Staring $@'
	@$(call run-npm-command,visualized-test)
	@echo 'Finished $@'


release:  ## Release
	@echo 'Start $@'
	@echo '1. Check tests is ok'
	npm run test

	@echo '2. Check build is ok'
	npm run build

	@echo '3. Version up'
	npm version $(version)

	@echo '4. Push'
	git push

	@echo '5. Rebuild with new version'
	npm run build

	@echo '6. Deploy'
	npm run deploy

	@echo 'Success All!!'
	@echo 'Create a pull request and merge to master!!'
	@echo 'https://github.com/tadashi-aikawa/owlora/compare/$(version)?expand=1'

	@echo 'End $@'
