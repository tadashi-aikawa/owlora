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

#----

DOCKER_IMAGE ?= tadashi-aikawa/owlora

define run-npm-command
	docker run \
	  -e AWS_ACCESS_KEY_ID=$(AWS_ACCESS_KEY_ID) \
	  -e AWS_SECRET_ACCESS_KEY=$(AWS_SECRET_ACCESS_KEY) \
	  -t $(DOCKER_IMAGE) \
	  npm run $(1)
endef


build-image: ## Build docker image
	@echo 'Starting $@'
	@docker build -t $(DOCKER_IMAGE) .
	@echo 'Finished $@'

visualized-test-init: ## Preparation of visualized-test. Need to set `WEBHOOK_URL` and `BUCKET_NAME`.
	@echo 'Starting $@'
	@cat make/regconfig-tmp.json | sed -e "s@---WEBHOOK_URL---@$(WEBHOOK_URL)@g" -e "s@---BUCKET_NAME---@$(BUCKET_NAME)@g" > regconfig.json
	@echo 'Finished $@'

visualized-test: build-image ## Visualized test. Need to set `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.
	@echo 'Staring $@' 
	@$(call run-npm-command,visualized-test-with-notify)
	@echo 'Finished $@'

visualized-test-quietly: build-image ## Visualized test without notification. Need to set `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.
	@echo 'Staring $@' 
	@$(call run-npm-command,visualized-test-without-notify)
	@echo 'Finished $@'

