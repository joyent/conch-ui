# Conch UI

![Screenshot of Conch UI](./screenshot.png)

This repository contains all source needed to build the Web UI for the Conch
API service.

See the [Design Document](./DESIGN.md) for information regarding UI design and
development decisions.

## Requirements

[Yarn](https://yarnpkg.com) is required for building this project. Yarn will
automatically install dependencies before executing build commands.

GNU `make` is used for make commands.

## Development

To develop the Conch UI:

1. Start a local instance of the [Conch
API](https://github.com/joyent/conch/Conch) in a separate shell using `make
morbo` in the Conch repo. This will start Conch in development mode on port
5001.

2. Copy `config.js.dist` in this directory to `config.js`

3. Run `make start` in this repo to launch a hot-reloading server and open a
browser window to it.

Alternatively, run `make watch` in this directory to start an auto-compiling
process, which will raise errors and warnings without a hot-reloading server.
No running Conch instance is needed for this to work.

## Build for Production

Copy `config.js.dist` in this directory to `config.js` Edit `config.js` and
assign the `conchApi` to the HTTP/S URI of the Conch API host the UI will
issues requests against.  This server must have
CORS headers configured appropriately or be served at the same host as the API.

Run 'make build'. All web assets, including HTML, Javascript, CSS, images, and
dependencies, will output into `dist/`. You can serve this directory statically
using a proxy like nginx.
