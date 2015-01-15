setup:
	@npm install

test:
	@grunt jasmine

run:
	@grunt server

build:
	@grunt default

release:
	@grunt bump-only
	@make build
	@grunt bump-commit