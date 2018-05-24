import m from "mithril";
import stream from "mithril/stream";

import Spinner from "../component/Spinner";

export default () => {
	const roomFilterText = stream("");
	const roomNameFilter = roomName => roomName.indexOf(roomFilterText()) >= 0;
	const rackProgressFilter = stream(() => true);
	return {
		view: ({ attrs: { rackRooms, activeRoomName, activeRacks } }) =>
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
								oninput: m.withAttr("value", roomFilterText),
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
								rackProgressFilter(() => true);
							},
						},
						"all"
					),
					Object.values(
						rackRooms().reduce((acc, room) => {
							if (acc[room.progress]) return acc;
							acc[room.progress] = m(
								"a",
								{
									onclick(e) {
										e.target.parentElement.childNodes.forEach(
											e => e.classList.remove("is-active")
										);
										e.target.classList.add("is-active");
										rackProgressFilter(
											progress =>
												progress === room.progress
										);
									},
								},
								room.progress
							);
							return acc;
						}, {})
					)
				),
				rackRooms().reduce((acc, room) => {
					if (
						roomNameFilter(room.name) &&
						rackProgressFilter()(room.progress)
					)
						acc.push(
							m(
								"a.panel-block",
								{
									onclick: e => {
										activeRoomName(room.name);
										activeRacks(room.racks);
									},
									class:
										activeRoomName() === room.name &&
										"is-active",
								},
								room.name
							)
						);
					return acc;
				}, [])
			),
	};
};
