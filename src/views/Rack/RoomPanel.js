import m from "mithril";

import Spinner from "../component/Spinner";

import RackLayout from "./RackLayout";

export default () => {
	let roomFilterText = "";
	const roomNameFilter = roomName => roomName.indexOf(roomFilterText) >= 0;
	let racksFilter = () => true;
	return {
		view: ({ attrs: { state } }) =>
			m(
				"nav.panel",
				m("p.panel-heading", "Datacenter Rooms"),
				m(
					".panel-block",
					m(
						"p.control.has-icons-left",
						m(
							"input.input.is-small[type=text][placeholder=Search Rooms]",
							{
								oninput: m.withAttr("value", v => {
									roomFilterText = v;
								}),
							}
						),
						m("span.icon.is-small.is-left", m("i.fas fa-search"))
					)
				),
				m(
					"p.panel-tabs",
					m(
						"a.is-active",
						{
							onclick(e) {
								e.target.parentElement.childNodes.forEach(e =>
									e.classList.remove("is-active")
								);
								e.target.classList.add("is-active");
								racksFilter = () => true;
							},
						},
						"all"
					),
					Object.values(
						state.rackRooms.reduce((acc, room) => {
							if (acc[room.progress]) return acc;
							acc[room.progress] = m(
								"a",
								{
									onclick(e) {
										e.target.parentElement.childNodes.forEach(
											e => e.classList.remove("is-active")
										);
										e.target.classList.add("is-active");
										racksFilter = progress =>
											progress === room.progress;
									},
								},
								room.progress
							);
							return acc;
						}, {})
					)
				),
				state.rackRooms.reduce((acc, room) => {
					if (roomNameFilter(room.name) && racksFilter(room.progress))
						acc.push(
							m(
								"a.panel-block",
								{
									onclick: e => {
										state.activeRoomName = room.name;
										state.activeRacks = room.racks;
										e.target.parentElement.childNodes.forEach(
											e => e.classList.remove("is-active")
										);
										e.target.classList.add("is-active");
									},
								},
								room.name
							)
						);
					return acc;
				}, [])
			),
	};
};
