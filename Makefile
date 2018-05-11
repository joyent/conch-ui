.PHONY: build
build: dist/index.html ## Build web assets for production

.PHONY: watch
watch: ## Watch web assets and re-build for development
	@yarn watch

.PHONY: start
start: ## Start a development web server that watches and hot-reloads code
	@yarn start

.PHONY: analyze
analyze: ## Analyze production web asset bundle sizes to find bloat
	@yarn analyze

dist/index.html: src/**/*
	@yarn build

.PHONY: help
help: ## Display this help message
	@echo "GNU make(1) targets:"
	@grep -E '^[a-zA-Z_.-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

