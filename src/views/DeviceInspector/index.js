import m from "mithril";
import moment from "moment";
import sortBy from "lodash/sortBy";
import stream from "mithril/stream";
import { request } from "mithril";
import countBy from "lodash/countBy";
import groupBy from "lodash/groupBy";

import { conchApi } from "config";

import { RadialProgress, Spinner } from "../component";

import Tabs from "./Tabs";
import NetworkingTab from "./NetworkingTab";
import OverviewTab from "./OverviewTab";
import SettingsTab from "./SettingsTab";
import StorageTab from "./StorageTab";
import ValidationTab from "./ValidationTab";
import ReportTab from "./ReportTab";

export default () => {
	const activeDevice = stream();
	const deviceSettings = stream();
	let deviceLoading = true;

	return {
		oninit: ({ attrs: { activeDeviceId } }) => {
			activeDeviceId.map(deviceId => {
				if (deviceId == null) return;
				deviceLoading = true;
				request({
					method: "GET",
					url: `${conchApi}/device/${deviceId}`,
					withCredentials: true
				}).then(res => {
					activeDevice(res);
					deviceLoading = false;
				});
				request({
					method: "GET",
					url: `${conchApi}/device/${deviceId}/settings`,
					withCredentials: true
				}).then(deviceSettings);
			});
		},
		view: ({ attrs: { activeDeviceId } }) => {
			return deviceLoading
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
							deviceSettings
						})
				  ];
		}
	};
};
