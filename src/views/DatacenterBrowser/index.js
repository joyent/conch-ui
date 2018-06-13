import m from "mithril";
import search from "fuzzysearch";
import stream from "mithril/stream";
import { request } from "mithril";

import { conchApi } from "config";

import { Spinner, ViewTitleHero } from "../component/";

import DeviceModal from "../DeviceModal";
import LayoutPanel from "./LayoutPanel";
import RackPanel from "./RackPanel";
import RoomPanel from "./RoomPanel";
import { roomToProgress } from "./Progress";

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

	const workspaceDevices = stream();
	const searchText = stream();

	const maxFoundDevices = 12;
	const foundDevices = stream.combine(
		(devices, text) => {
			if (!text()) return;
			return devices().reduce((acc, device) => {
				if (acc.length > maxFoundDevices) return acc;
				const needle = text().toLowerCase();
				if (
					search(needle, device.id.toLowerCase()) ||
					(device.asset_tag &&
						search(needle, device.asset_tag.toLowerCase()))
				) {
					acc.push(device);
				}
				return acc;
			}, []);
		},
		[workspaceDevices, searchText]
	);

	const searchedDevice = stream();

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
			currentWorkspace.map(({ id }) => {
				request({
					method: "GET",
					url: `${conchApi}/workspace/${id}/device`,
					withCredentials: true
				}).then(devices => {
					// sort by ID
					devices.sort((a, b) => {
						if (a.id < b.id) {
							return -1;
						}
						if (a.id > b.id) {
							return 1;
						}
						return 0;
					});

					workspaceDevices(devices);
				});

				request({
					method: "GET",
					url: `${conchApi}/workspace/${id}/rack`,
					withCredentials: true
				}).then(res => {
					// transform the response in to a list of rack rooms (from than
					// a tree-like object) and compute the 'progress' of each room.
					rackRooms(
						Object.keys(res)
							.sort()
							.reduce((acc, name) => {
								let racks = res[name];
								acc.push({
									name,
									racks,
									progress: roomToProgress(racks)
								});
								return acc;
							}, [])
					);
				});
			});

			searchedDevice.map(device => {
				request({
					method: "GET",
					url: `${conchApi}/device/${device.id}/location`,
					withCredentials: true
				}).then(deviceLoc => {
					activeRoomName(deviceLoc.datacenter.name);
					// delay to prevent a race in setting the route
					setTimeout(() => activeRackId(deviceLoc.rack.id), 10);
				});
			});
		},
		view: ({ attrs: { currentWorkspace } }) => {
			return [
				m(ViewTitleHero, {
					title: `${currentWorkspace().name} workspace datacenters`,
					subtitle: `Browse datacenter rooms, racks, and devices`
				}),
				m(
					"section.info-tiles",
					m(
						".tile.is-ancestor.has-text-right",
						m(
							".tile.is-parent",
							m(
								"article.tile.is-child.box",
								{ style: "padding: 0.75rem" },
								m(
									".dropdown.is-right",
									{ class: searchText() && "is-active" },
									m(
										".dropdown-trigger",
										m(
											".control",
											{
												class:
													!workspaceDevices() &&
													searchText() &&
													"is-loading"
											},
											m(
												"input.input[placeholder=Search for Device]",
												{
													oninput: m.withAttr(
														"value",
														searchText
													),
													// sets the search text if you leave the field and return
													onfocus: m.withAttr(
														"value",
														searchText
													)
												}
											)
										)
									),
									m(
										".dropdown-menu.is-paddingless",
										m(
											".dropdown-content",
											foundDevices() &&
												foundDevices().map(device =>
													m(
														"a.dropdown-item",
														{
															onclick() {
																searchedDevice(
																	device
																);
																searchText("");
															}
														},
														device.id,
														device.asset_tag &&
															m(
																"span.has-text-grey-light",
																` ${
																	device.asset_tag
																}`
															)
													)
												)
										)
									)
								)
							)
						)
					),
					m(
						".tile.is-ancestor.has-text-right",
						m(
							".tile.is-parent",
							m(
								"article.tile.is-child",
								activeDeviceId() &&
									m(DeviceModal, {
										activeDeviceId
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
														currentWorkspace,
														activeRack,
														rackLoading,
														rackLayout,
														activeDeviceId,
														searchedDevice
													})
											)
									  )
							)
						)
					)
				)
			];
		}
	};
};
