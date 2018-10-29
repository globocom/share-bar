.SILENT:
.DEFAULT_GOAL=help

COLOR_RESET = \033[0m
COLOR_GREEN = \033[32m
COLOR_YELLOW = \033[33m

PROJECT_NAME = `basename $(PWD)`

## prints this help
help:
	printf "${COLOR_YELLOW}\n${PROJECT_NAME}\n\n${COLOR_RESET}"
	awk '/^[a-zA-Z\-\_0-9\.%]+:/ { \
		helpMessage = match(lastLine, /^## (.*)/); \
		if (helpMessage) { \
			helpCommand = substr($$1, 0, index($$1, ":")); \
			helpMessage = substr(lastLine, RSTART + 3, RLENGTH); \
			printf "${COLOR_GREEN}$$ make %s${COLOR_RESET} %s\n", helpCommand, helpMessage; \
		} \
	} \
	{ lastLine = $$0 }' $(MAKEFILE_LIST)
	printf "\n"

## install project dependencies
setup:
	@npm install

## run tests
test:
	@grunt jasmine

## run a local server for local development use
run:
	@grunt server

## build application
build:
	@grunt default

## build and release
release:
	@grunt bump-only
	@make build
	@grunt bump-commit