import { Spinner } from "../component";

export default () => {
	let konva;
	let libsLoaded = false;

	return {
		oninit: () => {
			Promise.all([import("konva")]).then(([konvaLib]) => {
				konva = konvaLib;
				libsLoaded = true;
			});
		},
		view: () => {
			return libsLoaded == null
				? m(Spinner)
				: m("section.section", m("box"));
		}
	};
};
