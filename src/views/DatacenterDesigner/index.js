import m from "mithril";
import stream from "mithril/stream";

import { Spinner } from "../component";
import IsometricStage from "./IsometricStage";
import FlatStage from "./FlatStage";

export default () => {
	let konva;
	let obelisk;
	let libsLoaded = false;

	const boxes = [
		stream({ id: 1, x: 3, y: 3 }),
		stream({ id: 2, x: 10, y: 3 })
	];

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
				: m(
						".columns",
						m(
							".column.is-5",
							m(
								".box",
								m(FlatStage, {
									konva,
									boxes,
									gridSize: 32,
									rows: 16,
									columns: 16
								})
							)
						),
						m(
							".column.is-6",
							m(IsometricStage, {
								obelisk,
								boxes,
								gridSize: 24,
								zHeightMax: 9,
								rows: 16,
								columns: 16
							})
						)
				  );
		}
	};
};
