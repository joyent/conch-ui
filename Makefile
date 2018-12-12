.PHONY: build
build: node_modules dist/index.html ## Build web assets for production

.PHONY: test
test: build config.js ## test to ensure everything functions as we expect (currently "it builds clean")
	@yarn jest

.PHONY: watch
watch: ## Watch web assets and re-build for development
	@yarn watch

.PHONY: start
start: ## Start a development web server that watches and hot-reloads code
	@yarn start

.PHONY: analyze
analyze: ## Analyze production web asset bundle sizes to find bloat
	@yarn analyze

.PHONY: format
format: ## Format Javascript source files with prettier
	@yarn prettier

node_modules: yarn.lock
	@yarn install
	@touch node_modules

dist/index.html: src/**/* config.js webpack.common.js webpack.prod.js
	@yarn build

config.js:
	@node_modules/.bin/babel config.js.dist  > src/config.js
	@ln -s src/config.js config.js

.PHONY: docker_test
docker_test: ## Run the test suite inside docker
	docker/test.bash

.PHONY: help
help: ## Display this help message
	@echo "GNU make(1) targets:"
	@grep -E '^[a-zA-Z_.-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'
