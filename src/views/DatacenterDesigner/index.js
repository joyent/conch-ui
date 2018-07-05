import m from "mithril";
import stream from "mithril/stream";

import { Spinner } from "../component";
import IsometricStage from "./IsometricStage";
import Controls from "./Controls";
import FlatStage from "./FlatStage";

import { Tiles } from "./Tiles";

export default () => {
	const rows = 16;
	const columns = 16;

	let konva;
	let obelisk;
	let libsLoaded = false;

	const boxes = [
		stream({ id: 1, x: 3, y: 3 }),
		stream({ id: 2, x: 10, y: 3 })
	];

	const tiles = stream(new Tiles(rows, columns));

	const activeTileType = stream();

	return {
		oninit: () => {
			// load required libraries asyncronously. Also allows for splitting
			// these libraries into separate chunks
			Promise.all([import("konva"), import("obelisk.js")]).then(libs => {
				[konva, obelisk] = libs;
				libsLoaded = true;
				m.redraw();
			});
		},
		view: () => {
			return m(
				"section",
				!libsLoaded
					? m(Spinner)
					: [
							m(
								".tile.is-ancestor.has-text-centered",
								m(
									".tile.is-parent.is-vertical",
									m(
										".tile.is-child",
										m(Controls, {
											tileTypes: [],
											activeTileType
										})
									),
									m(
										".tile.is-child",
										m(IsometricStage, {
											obelisk,
											boxes,
											tiles,
											gridSize: 10,
											zHeightMax: 9,
											rows,
											columns
										})
									)
								),
								m(
									".tile.is-parent",
									m(
										".tile.is-child.box",
										m(FlatStage, {
											konva,
											boxes,
											tiles,
											gridSize: 32,
											rows,
											columns,
											activeTileType
										})
									)
								)
							)
					  ]
			);
		}
	};
};
