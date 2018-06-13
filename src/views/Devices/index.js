import m from "mithril";
import search from "fuzzysearch";
import stream from "mithril/stream";
import { request } from "mithril";

import { conchApi } from "config";

import { Spinner, ViewTitleHero } from "../component/";

import DevicesPanel from "./DevicesPanel";
import DeviceInspector from "../DeviceInspector";

export default () => {
	const workspaceDevices = stream();
	const activeDeviceId = stream();

	return {
		oninit: ({ attrs: { currentWorkspace } }) => {
			activeDeviceId.map(deviceId => {
				const route = m.route.get();
				const routePrefix = route.substring(
					0,
					route.indexOf("/device")
				);
				if (deviceId) m.route.set(`${routePrefix}/device/${deviceId}`);
				else m.route.set(`${routePrefix}/device`);
			});

			m.route.param("deviceId") &&
				activeDeviceId(m.route.param("deviceId"));

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
								workspaceDevices() == null
									? m("section.section", m(Spinner))
									: m(
											".columns",
											m(
												".column.is-4",
												m(DevicesPanel, {
													workspaceDevices,
													activeDeviceId
												})
											),
											activeDeviceId() &&
												m(
													".column.is-6.container",
													m(DeviceInspector, {
														activeDeviceId
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
