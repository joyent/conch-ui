// views/status/StatusTiles.js

import m from "mithril";
import { Spinner } from "views/component";
import RackProgress from "views/Status/RackProgress";

const StatusTile = {
	view: ({ children }) =>
		m(".tile.is-parent", m("article.tile.is-child.box", children))
};

export default update => {
	return {
		view: ({ attrs: { model } }) => {
			console.log(model);
			return m(
				"section.info-tiles",
				m(
					".tile.is-ancestor.has-text-centered",
					m(
						StatusTile,
						m(
							`progress.progress.is-info[value=${
								model.progress.percent
							}][max=100]`,
							`${model.progress.percent}%`
						)
					)
				),
				m(
					".tile.is-ancestor.has-text-centered",
					m(
						StatusTile,
						model.rooms.rackCount
							? m(Spinner)
							: [
									m("p.title", model.rooms.rackCount),
									m("p.subtitle", "Racks")
							  ]
					),
					m(
						StatusTile,
						model.devices
							? m(Spinner)
							: [
									m("p.title", model.devices.length),
									m("p.subtitle", "Devices")
							  ]
					)
				),
				m(
					".tile.is-ancestor.has-text-centered",
					m(
						StatusTile,
						m(
							"div.box",
							{
								style:
									"background-color:rgba(28%, 61%, 91%, 0.4)"
							},
							model.rooms.rackRooms
								? m(Spinner)
								: [
										m(
											"p.subtitle",
											"Rack Validation Status"
										),
										m(RackProgress, {
											rackRooms: model.rooms.rackRooms,
											group: "status"
										})
								  ]
						)
					),
					m(
						StatusTile,
						m(
							"div.box",
							{
								style:
									"background-color:rgba(28%, 61%, 91%, 0.4)"
							},
							model.rooms.rackRooms
								? m(Spinner)
								: [
										m(
											"p.subtitle",
											"Validation Status by Role"
										),
										m(RackProgress, {
											rackRooms:
												model.rackrooms.rackRooms,
											group: "role"
										})
								  ]
						)
					)
				)
			);
		}
	};
};


