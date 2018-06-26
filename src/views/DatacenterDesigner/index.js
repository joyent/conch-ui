import m from "mithril";
import stream from "mithril/stream";

import { Spinner } from "../component";
import IsometricStage from "./IsometricStage";
import Controls from "./Controls";
import FlatStage from "./FlatStage";

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

	const tiles = stream([]);

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
			return !libsLoaded
				? m(Spinner)
				: [
						m(Controls, {
							tileTypes: [
								{ name: "Cold Tile", type: "cold" },
								{ name: "Hot Tile", type: "hot" }
							],
							activeTileType
						}),
						m(
							".columns",
							m(
								".column.is-5",
								m(
									".box",
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
							),
							m(
								".column.is-6",
								m(IsometricStage, {
									obelisk,
									boxes,
									tiles,
									gridSize: 24,
									zHeightMax: 9,
									rows,
									columns
								})
							)
						)
				  ];
		}
	};
};
