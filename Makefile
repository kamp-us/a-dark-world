SHELL := /bin/bash

ENTRYPOINTS := src/background.ts src/index.ts src/content.ts

build:
	@echo "Building the project..."
	bun build $(ENTRYPOINTS) --outdir ./out

watch:
	@echo "Watching the project..."
	bun build $(ENTRYPOINTS) --outdir ./out --watch

clean:
	@echo "Cleaning the project..."
	rm -rf ./out
