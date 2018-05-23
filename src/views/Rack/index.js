import m from "mithril";
import { request } from "mithril";

import { conchApi } from "config";

import Spinner from "../component/Spinner";

export default () => {
	let state = {};
	let rackCount;
	let rackRooms;
	let filterText = '';

	return {
		oninit({ attrs: { currentWorkspace } }) {
			request({
				method: "GET",
				url: `${conchApi}/workspace/${currentWorkspace.id}/rack`,
				withCredentials: true,
			}).then(res => {
				// sort and assign the rack rooms
				rackCount = 0;
				rackRooms = Object.keys(res)
					.sort()
					.reduce((acc, room) => {
						acc[room] = res[room];
						rackCount += res[room].length;
						return acc;
					}, {});
			});
		},
		view: () => [
			m(
				"section.hero.is-primary.welcome.is-small",
				m(
					".hero-body",
					m("h1.title", "Datacenter Racks"),
					m("h2.subtitle", `Racks`)
				)
			),
			m(
				"nav.panel",
				m("p.panel-heading", "Datacenter Racks"),
				rackRooms == null
					? m(Spinner)
					: [
							m(
								".panel-block",
								m(
									"p.control.has-icons-left",
									m(
										"input.input.is-small[type=text][placeholder=Filter]",
										{
											oninput: m.withAttr("value", v => {
												filterText = v;
											}),
										}
									),
									m(
										"span.icon.is-small.is-left",
										m("i.fas fa-search")
									)
								)
							),
							Object.keys(rackRooms).reduce((acc, rackRoom) => {
								if ( rackRoom.indexOf(filterText) >= 0 )
									acc.push(m("a.panel-block", rackRoom));
								return acc;
							}, []),
					  ]
			),
		],
	};
};
