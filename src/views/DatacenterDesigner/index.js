import m from "mithril";
import stream from "mithril/stream";

import { Spinner } from "../component";
import IsometricStage from "./IsometricStage";
import Controls from "./Controls";
import Progress from "./Progress";
import FlatStage from "./FlatStage";

import { Tiles } from "./Tiles";

export default () => {
	const rows = 16;
	const columns = 16;

	let konva;
	let obelisk;
	let libsLoaded = false;

	const racks = stream([]);

	const tiles = stream(new Tiles(rows, columns));
	const maxAmps = stream(0);
	const targetTBs = stream(0);

	const activeTileType = stream();
	const activeRackType = stream();

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
							m(Controls, {
								activeTileType,
								activeRackType,
								targetTBs,
								maxAmps
							}),
							m(
								".tile.is-ancestor.has-text-centered",
								m(
									".tile.is-parent.is-vertical",
									m(
										".tile.is-child",
										m(Progress, {
											racks,
											targetTBs,
											maxAmps
										})
									)
								)
							),

							m(
								".tile.is-ancestor.has-text-centered",
								m(
									".tile.is-parent.is-vertical",
									m(".tile.is-child"),
									m(
										".tile.is-child",
										m(IsometricStage, {
											obelisk,
											racks,
											tiles,
											gridSize: 16,
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
											racks,
											tiles,
											gridSize: 32,
											rows,
											columns,
											activeTileType,
											activeRackType
										})
									)
								)
							)
					  ]
			);
		}
	};
};
