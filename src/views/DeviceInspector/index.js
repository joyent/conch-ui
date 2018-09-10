import m from "mithril";
import moment from "moment";
import sortBy from "lodash/sortBy";
import stream from "mithril/stream";
import { request } from "mithril";
import countBy from "lodash/countBy";
import groupBy from "lodash/groupBy";

import { conchApi } from "config";

import { RadialProgress, Spinner } from "views/component";

import Tabs from "views/DeviceInspector/Tabs";
import NetworkingTab from "views/DeviceInspector/NetworkingTab";
import OverviewTab from "views/DeviceInspector/OverviewTab";
import SettingsTab from "views/DeviceInspector/SettingsTab";
import TagsTab from "views/DeviceInspector/TagsTab";
import StorageTab from "views/DeviceInspector/StorageTab";
import ValidationTab from "views/DeviceInspector/ValidationTab";
import ReportTab from "views/DeviceInspector/ReportTab";

import Device from "models/Device";

export default () => {
	const activeDevice = stream();
	let deviceLoading = true;
	let intervalId;

	return {
		oninit: ({ attrs: { activeDeviceId } }) => {
			activeDeviceId.map(deviceId => {
				if (deviceId == null) return;
				const device = new Device(deviceId);
				device.ready().then(() => {
					activeDevice(device);
				});
			});

			// refresh the device, settings, and any dependent streams every 15
			// seconds
			//intervalId = setInterval(() => {
			//	activeDeviceId(activeDeviceId());
			//}, 15000);
		},
		onremove: () => {
			//clearInterval(intervalId);
		},
		view: ({ attrs: { activeDeviceId } }) => {
			return activeDevice() == null
				? m("section.section", m(Spinner))
				: [
						m(Tabs, {
							tabs: [
								{
									title: "Overview",
									component: OverviewTab
								},
								{
									title: "Validation",
									component: ValidationTab
								},
								{
									title: "Settings",
									component: SettingsTab
								},
								{
									title: "Tags",
									component: TagsTab
								},
								{
									title: "Storage",
									component: StorageTab
								},
								{
									title: "Networking",
									component: NetworkingTab
								},
								{
									title: "Latest Report",
									component: ReportTab
								}
							],
							activeDevice,
							activeDeviceId
						})
				  ];
		}
	};
};
