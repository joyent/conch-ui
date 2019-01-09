import m from "mithril";
import search from "fuzzysearch";
import stream from "mithril/stream";

import { Spinner, ViewTitleHero } from "views/component/";

import DeviceModal from "views/DeviceModal";
import LayoutPanel from "views/DatacenterBrowser/LayoutPanel";
import RackPanel from "views/DatacenterBrowser/RackPanel";
import RoomPanel from "views/DatacenterBrowser/RoomPanel";
import { roomToProgress } from "views/DatacenterBrowser/Progress";

import Workspace from "models/Workspace";
import Device from "models/Device";

export default () => {
	const rackFilterText = stream("");
	const rackRooms = stream();
	const activeRoomName = stream();
	const activeRoom = stream.combine(
		(rooms, activeName) => rooms().find(room => room.name === activeName()),
		[rackRooms, activeRoomName]
	);

	let rackLayout = stream();

	const activeRacks = activeRoom.map(room => {
		// reset layoutRack
		rackLayout = stream();
		return room
			? room.racks.sort((a, b) => (a.name > b.name ? 1 : -1))
			: stream.HALT;
	});
	const activeRackId = stream();

	// finds the active rack in activeRacks with activeRackId
	const activeRack = stream.combine(
		(racks, id) => racks().find(rack => rack.id === id()) || stream.HALT,
		[activeRacks, activeRackId]
	);
	const rackLoading = stream();

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
	const highlightDeviceId = stream();

	return {
		oninit({ attrs: { currentWorkspace } }) {
			// side-effect: load the rack whenever activeRack updates
			const workspace = currentWorkspace();
			activeRack.map(rack => {
				rackLoading(true);
				workspace.getRackById(rack.id).then(res => {
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
				let [_, queryS] = route.split("?");
				queryS ? (queryS = `?${queryS}`) : (queryS = "");

				if (deviceId)
					m.route.set(`${routePrefix}/device/${deviceId}${queryS}`);
				else m.route.set(`${routePrefix}/device`);
			});
			currentWorkspace.map(({ id }) => {
				const workspace = new Workspace(id);
				workspace.getDevices().then(devices => {
					// sort by ID
					devices.sort((a, b) => a.id - b.id);
					workspaceDevices(devices);
				});

				workspace.getAllRacks().then(res => {
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

			searchedDevice.map(d => {
				const device = new Device(d.id);
				device.getLocation().then(deviceLoc => {
					activeRoomName(deviceLoc.datacenter.name);
					// delay to prevent a race in setting the route
					setTimeout(() => activeRackId(deviceLoc.rack.id), 10);
					highlightDeviceId(device.id);
				});
			});
		},
		view: ({ attrs: { currentWorkspace } }) => {
			m.route.param("highlightDeviceId") &&
				highlightDeviceId(m.route.param("highlightDeviceId"));

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
														highlightDeviceId
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
