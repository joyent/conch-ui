# Conch UI

![Screenshot of Conch UI](./screenshot.png)

This report contains source for the Conch front-end UI. 

See the [Design Document](./DESIGN.md) for information regarding UI design and
development decisions.

## Requirements

[Yarn](https://yarnpkg.com) is required for building this project. Yarn will
automatically install dependencies before executing build commands.

GNU `make` is used for make commands.

## Development

Start a local instance of Conch in a separate shell using `make morbo` in the
Conch repo. This will start Conch in development mode on port 5001.

Run `make start` in this repo to launch a hot-reloading server and open a
browser window to it.

Alternatively, run `make watch` to start an auto-compiling process, which will
raise errors and warnings. No running Conch instance is needed for this to work.

## Build for Production

Configure the Conch API URI the UI will request against in `config.js`. This
server must have CORS headers configured appropriately or be served at the same
host as the API.

Run 'make build'. All web assets, including Javascript, CSS, images, and
dependencies, will output into `dist/`. You can serve this directory statically
using a proxy like nginx.
