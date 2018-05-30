import m from "mithril";
import stream from "mithril/stream";
import { request } from "mithril";

import { conchApi } from "config";

import { Spinner, ViewTitleHero } from "../component/";

import LayoutPanel from "./LayoutPanel";
import RackPanel from "./RackPanel";
import RoomPanel from "./RoomPanel";
import DeviceModal from "./DeviceModal";

export default () => {
	const rackFilterText = stream("");
	const rackRooms = stream();
	const activeRoomName = stream();
	const activeRoom = stream.combine(
		(rooms, activeName) => rooms().find(room => room.name === activeName()),
		[rackRooms, activeRoomName]
	);

	const activeRacks = activeRoom.map(
		room =>
			room
				? room.racks.sort((a, b) => (a.name > b.name ? 1 : -1))
				: stream.HALT
	);
	const activeRackId = stream();

	// finds the active rack in activeRacks with activeRackId
	const activeRack = stream.combine(
		(racks, id) => racks().find(rack => rack.id === id()) || stream.HALT,
		[activeRacks, activeRackId]
	);
	const rackLoading = stream();

	let rackLayout = stream();
	// if there's no activeRoom, reset layoutRack
	activeRoom.map(a => {
		if (a == null) rackLayout = stream();
	});

	const activeDeviceId = stream();
	const deviceLoading = stream();
	const activeDevice = stream();
	let deviceXHR;

	return {
		oninit({ attrs: { currentWorkspace } }) {
			// side-effect: load the rack whenever activeRack updates
			activeRack.map(rack => {
				rackLoading(true);
				request({
					method: "GET",
					url: `${conchApi}/workspace/${currentWorkspace().id}/rack/${
						rack.id
					}`,
					withCredentials: true
				}).then(res => {
					rackLayout(res);
					rackLoading(false);
				});
			});

			activeDeviceId.map(deviceId => {
				// cancel previous, unfinished requests
				if (deviceXHR) {
					deviceXHR.abort();
					deviceXHR = null;
				}

				if (deviceId == null) return;
				deviceLoading(true);
				request({
					method: "GET",
					url: `${conchApi}/device/${deviceId}`,
					withCredentials: true,
					config: xhr => {
						deviceXHR = xhr;
					}
				}).then(res => {
					activeDevice(res);
					deviceLoading(false);
				});
			});

			m.route.param("roomName") &&
				activeRoomName(m.route.param("roomName"));
			m.route.param("rackId") && activeRackId(m.route.param("rackId"));
			m.route.param("deviceId") &&
				activeDeviceId(m.route.param("deviceId"));

			activeRoomName.map(name => {
				const route = m.route.get();
				const routePrefix = route.substring(
					0,
					route.indexOf("/datacenter")
				);
				m.route.set(`${routePrefix}/datacenter/${name}/rack`);
			});
			activeRackId.map(rackId => {
				const route = m.route.get();
				const routePrefix = route.substring(0, route.indexOf("/rack"));
				m.route.set(`${routePrefix}/rack/${rackId}/device`);
			});
			activeDeviceId.map(deviceId => {
				const route = m.route.get();
				const routePrefix = route.substring(
					0,
					route.indexOf("/device")
				);
				if (deviceId) m.route.set(`${routePrefix}/device/${deviceId}`);
				else m.route.set(`${routePrefix}/device`);
			});
			currentWorkspace.map(({ id }) =>
				request({
					method: "GET",
					url: `${conchApi}/workspace/${id}/rack`,
					withCredentials: true
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
									progress = "in progress";
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
				})
			);
		},
		view: ({ attrs: { currentWorkspace } }) => {
			return [
				m(ViewTitleHero, {
					title: `${currentWorkspace().name} datacenters`,
					subtitle: `Explore datacenter racks`
				}),
				activeDeviceId() &&
					m(DeviceModal, {
						activeDeviceId,
						activeDevice,
						deviceLoading
					}),
				rackRooms() == null
					? m("section.section", m(Spinner))
					: m(
							".columns.is-gapless",
							m(
								".column.is-3",
								m(RoomPanel, {
									rackRooms,
									activeRoomName
								})
							),
							m(
								".column.is-3",
								activeRoom() &&
									m(RackPanel, {
										activeRoomName,
										activeRacks,
										activeRackId
									})
							),
							m(
								".column.is-6",
								rackLayout() &&
									m(LayoutPanel, {
										activeRack,
										rackLoading,
										rackLayout,
										activeDeviceId
									})
							)
					  )
			];
		}
	};
};
