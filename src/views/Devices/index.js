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

let workspaceDevices = stream();

export default () => {
	const hardwareProductLookup = stream();
	const hardwareProducts = new HardwareProducts();

	const activeDeviceId = workspaceDevices.map(devices => {
		const activeDevice = devices.find(
			d => d && d.id === m.route.param("deviceId")
		);
		return activeDevice && activeDevice.id;
	});

	return {
		oninit: ({ attrs: { currentWorkspace } }) => {
			hardwareProducts
				.get()
				.then(hardwareProducts => keyBy(hardwareProducts, "id"))
				.then(hardwareProductLookup);

			currentWorkspace.map(workspace => {
				workspace
					.getDevices()
					.then(devices => devices.sort((a, b) => a.id - b.id))
					.then(workspaceDevices);
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
								hardwareProductLookup() == null
									? m("section.section", m(Spinner))
									: m(
											".columns",
											m(
												".column.is-4",
												m(DevicesPanel, {
													workspaceDevices,
													hardwareProductLookup: hardwareProductLookup(),
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
