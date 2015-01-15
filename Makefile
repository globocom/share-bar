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
	@git commit -am "Builded statics"
	@git push origin master
	@grunt bump-commit