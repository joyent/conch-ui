.PHONY: build

build: dist/index.html

dist/index.html: index.js src/**
	yarn build
