import m from "mithril";
import search from "fuzzysearch";
import stream from "mithril/stream";
import Request from "util/Request";
import keyBy from "lodash/keyBy";
import sortBy from "lodash/keyBy";

import { Spinner, ViewTitleHero } from "views/component/";

import DevicesPanel from "views/Devices/DevicesPanel";
import DeviceInspector from "views/DeviceInspector";

import HardwareProducts from "models/HardwareProduct";
import Workspace from "models/Workspace";

export default () => {
	let workspaceDevices = stream();
	let hardwareProductLookup;
	const activeDeviceId = stream();
	const hardwareProducts = new HardwareProducts();

	return {
		oninit: ({ attrs: { currentWorkspace } }) => {
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

			m.route.param("deviceId") &&
				activeDeviceId(m.route.param("deviceId"));
			hardwareProducts.get().then(hardwareProducts => {
				hardwareProductLookup = keyBy(hardwareProducts, "id");
			});

			currentWorkspace.map(({ id }) => {
				// drop the previous stream
				workspaceDevices = stream();
				const workspace = new Workspace(id);
				workspace.getDevices().then(devices => {
					let foundActiveDevice = false;
					// sort and attempt to find the currently active device ID
					devices.sort((a, b) => {
						if (
							activeDeviceId() != null &&
							(activeDeviceId() === a.id ||
								activeDeviceId() === b.id)
						)
							foundActiveDevice = true;
						// negative == a, 0, postiive == b
						return a.id - b.id;
					});
					workspaceDevices(devices);
					if (!foundActiveDevice) activeDeviceId(null);
				});
			});
		},
		view: ({ attrs: { currentWorkspace } }) => {
			return [
				m(ViewTitleHero, {
					title: `${currentWorkspace().name} workspace devices`,
					subtitle: `Search and filter workspace devices`
				}),
				m(
					"section.info-tiles",
					m(
						".tile.is-ancestor.has-text-right",
						m(
							".tile.is-parent",
							m(
								"article.tile.is-child",
								workspaceDevices() == null ||
								hardwareProductLookup == null
									? m("section.section", m(Spinner))
									: m(
											".columns",
											m(
												".column.is-4",
												m(DevicesPanel, {
													workspaceDevices,
													hardwareProductLookup,
													activeDeviceId
												})
											),
											activeDeviceId() &&
												m(
													".column.is-6.container",
													m(
														"div",
														{
															// stick to the top as the page scrolls
															style:
																"position: -webkit-sticky; position: sticky; top: 0;"
														},
														m(
															".box.has-text-left",
															m(
																".subtitle",
																`Device ${activeDeviceId}`
															)
														),
														m(DeviceInspector, {
															activeDeviceId
														})
													)
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
