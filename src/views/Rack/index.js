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
	const activeRacks = stream();
	const activeRack = stream();
	const rackLayout = stream();
	const rackLoading = stream();

	return {
		oninit({ attrs: { currentWorkspace } }) {
			// load the rack whenever activeRack updates
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
									activeRacks,
								})
							),
							m(
								".column.is-3",
								activeRacks() &&
									m(RackPanel, {
										activeRoomName,
										activeRacks,
										activeRack,
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
