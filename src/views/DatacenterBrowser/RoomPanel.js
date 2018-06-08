import m from "mithril";
import stream from "mithril/stream";
import search from "fuzzysearch";

import Spinner from "../component/Spinner";
import { ProgressIcon } from "./Progress";

export default () => {
	const roomFilterText = stream("");
	const roomFilterTextLC = roomFilterText.map(t => t.toLowerCase());
	const roomNameFilter = roomName =>
		search(roomFilterTextLC(), roomName.toLowerCase());

	const selectedProgress = stream("all");
	const roomProgressFilter = p =>
		selectedProgress() === "all" || selectedProgress() === p;

	let availableRoomProgress;

	return {
		oninit: ({ attrs: { rackRooms } }) => {
			availableRoomProgress = rackRooms.map(rooms =>
				Array.from(
					rooms.reduce((acc, room) => {
						acc.add(room.progress);
						return acc;
					}, new Set(["all"]))
				).sort()
			);
		},
		view: ({ attrs: { rackRooms, activeRoomName } }) =>
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
								oninput: m.withAttr("value", roomFilterText)
							}
						),
						m("span.icon.is-small.is-left", m("i.fas fa-search"))
					)
				),
				m(
					"p.panel-tabs",
					availableRoomProgress().map(p =>
						m(
							"a",
							{
								onclick: e => {
									selectedProgress(p);
								},
								// don't break spaces
								style: "white-space:pre",
								class: selectedProgress() === p && "is-active"
							},
							p
						)
					)
				),
				rackRooms().reduce((acc, room) => {
					if (
						roomNameFilter(room.name) &&
						roomProgressFilter(room.progress)
					)
						acc.push(
							m(
								"a.panel-block",
								{
									onclick: e => {
										activeRoomName(room.name);
									},
									class:
										activeRoomName() === room.name &&
										"is-active"
								},
								m(
									".panel-icon",
									m(ProgressIcon, { progress: room.progress })
								),
								room.name
							)
						);
					return acc;
				}, [])
			)
	};
};
