import m from "mithril";
import stream from "mithril/stream";
import { request } from "mithril";

import { conchApi } from "config";

import Spinner from "../component/Spinner";

import LayoutPanel from "./LayoutPanel";
import RackPanel from "./RackPanel";
import RoomPanel from "./RoomPanel";

export default () => {
	const rackFilterText = stream("");
	const rackRooms = stream();
	const activeRoomName = stream();

	// find the active racks in the active room with activeRoomName
	const activeRacks = stream.combine(
		(rooms, activeName) => {
			let room = rooms().find(room => room.name === activeName());
			if (!room) return stream.HALT;
			return room.racks.sort((a, b) => (a.name > b.name ? 1 : -1));
		},
		[rackRooms, activeRoomName]
	);
	const activeRackId = stream();

	// finds the active rack in activeRacks with activeRackId
	const activeRack = stream.combine(
		(racks, id) => racks().find(rack => rack.id === id()) || stream.HALT,
		[activeRacks, activeRackId]
	);
	const rackLayout = stream();
	const rackLoading = stream();

	return {
		oninit({ attrs: { currentWorkspace } }) {
			// side-effect: load the rack whenever activeRack updates
			activeRack.map(rack => {
				rackLoading(true);
				request({
					method: "GET",
					url: `${conchApi}/workspace/${currentWorkspace.id}/rack/${
						rack.id
					}`,
					withCredentials: true,
				}).then(res => {
					rackLayout(res);
					rackLoading(false);
				});
			});

			m.route.param("roomName") &&
				activeRoomName(m.route.param("roomName"));
			m.route.param("rackId") && activeRackId(m.route.param("rackId"));

			activeRoomName.map(name => {
				const route = m.route.get();
				const routePrefix = route.substring(
					0,
					route.indexOf("/datacenter")
				);
				m.route.set(`${routePrefix}/datacenter/${name}/rack`);
			});
			activeRack.map(rack => {
				const route = m.route.get();
				const routePrefix = route.substring(0, route.indexOf("/rack"));
				m.route.set(`${routePrefix}/rack/${rack.id}`);
			});
			request({
				method: "GET",
				url: `${conchApi}/workspace/${currentWorkspace.id}/rack`,
				withCredentials: true,
			}).then(res => {
				// transform the response in to a list of rack rooms (from than
				// a tree-like object) and compute the 'progress' of each room.
				// A room is "failing" if one rack is failing, or "passing" if
				// one rack is passing, or "validated" if *every* rack is
				// validated. Otherwise, it's considered "not started".
				rackRooms(
					Object.keys(res)
						.sort()
						.reduce((acc, name) => {
							let progress;
							let racks = res[name];
							if (
								racks.some(
									rack => rack["device_progress"]["FAIL"]
								)
							) {
								progress = "failing";
							} else if (
								racks.some(
									rack => rack["device_progress"]["PASS"]
								)
							) {
								progress = "passing";
							} else if (
								racks.every(
									rack => rack["device_progress"]["VALID"]
								)
							) {
								progress = "validated";
							} else {
								progress = "not started";
							}
							acc.push({ name, racks, progress });
							return acc;
						}, [])
				);
			});
		},
		view: ({ attrs: { currentWorkspace } }) => {
			return [
				m(
					"section.hero.is-primary.welcome.is-small",
					m(
						".hero-body",
						m("h1.title", "Datacenter Racks"),
						m("h2.subtitle", `Racks`)
					)
				),
				rackRooms() == null
					? m("section.section", m(Spinner))
					: m(
							".columns.is-gapless",
							m(
								".column.is-3",
								m(RoomPanel, {
									rackRooms,
									activeRoomName,
								})
							),
							m(
								".column.is-3",
								activeRacks() &&
									m(RackPanel, {
										activeRoomName,
										activeRacks,
										activeRackId,
									})
							),
							m(
								".column.is-6",
								rackLayout() &&
									m(LayoutPanel, {
										activeRack,
										rackLoading,
										rackLayout,
									})
							)
					  ),
			];
		},
	};
};
