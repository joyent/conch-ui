import m from "mithril";
import stream from "mithril/stream";
import moment from "moment";

import { RadialProgress, Spinner } from "../component";

const TimeToBurnin = {
	view: ({ attrs: { activeDevice, deviceSettings } }) => {
		if (deviceSettings() == null) return m(Spinner);

		const { uptime_since, last_seen, health } = activeDevice();

		if (last_seen == null)
			return m("p.is-size-4", "Device has not reported");

		if (deviceSettings().firmware !== "current")
			return m("p.is-size-4", "Burn-in not started");

		// 30 minutes in seconds. Taken from the user settings used to store this value
		const maxBurnin = 1800;

		const numReboots = 3;
		const burninStageTime = maxBurnin / numReboots;
		const sinceLastReboot = uptime_since
			? moment().diff(moment(uptime_since), "seconds")
			: moment().diff(moment(last_seen), "seconds");

		const rebootCount = deviceSettings()["build.reboot_count"] || 0;

		if (health.toLowerCase() === "fail") {
			return [
				m(RadialProgress, {
					percentage: Math.trunc(rebootCount / numReboots * 100),
					strokeWidth: "20px",
					failing: true
				}),
				m(
					"p.subtitle",
					m("p", "Failing validation"),
					m("p", `${rebootCount} of ${numReboots} reboots complete`)
				)
			];
		}

		const time =
			maxBurnin - (rebootCount * burninStageTime + sinceLastReboot);

		const percentage = (() => {
			if (rebootCount === numReboots) return 100;
			if (time < 0) return Math.trunc(rebootCount / numReboots * 100);
			return Math.trunc((maxBurnin - time) / time * 100);
		})();

		return [
			m(RadialProgress, {
				percentage,
				strokeWidth: "20px"
			}),
			percentage === 100
				? m("p.subtitle", "Burn-in Complete")
				: m(
						"p.subtitle",
						time < 0 && m("p", "Should have finished"),
						moment.duration(time, "seconds").humanize(true)
				  )
		];
	}
};
const OverviewTab = () => {
	let deviceTags = [];
	return {
		oninit: ({ attrs: { activeDevice, deviceSettings } }) => {
			deviceTags = stream.combine(
				(device, settings) => {
					let tags = [];
					if (device().health.toLowerCase() === "fail")
						tags.push(m(".tag.is-danger", "Failing Validaiton"));
					else if (device().health.toLowerCase() === "pass")
						tags.push(m(".tag.is-info", "Passing Validation"));
					else if (device().health.toLowerCase() === "unknown")
						tags.push(m(".tag.is-warning", "No report"));

					if (settings().firmware === "updating")
						tags.push(m(".tag.is-warning", "Firmware Updating"));

					if (device().validated)
						tags.push(m(".tag.is-success", "Validated"));
					if (device().graduated)
						tags.push(m(".tag.is-success", "Graduated"));
					if (device().triton_setup)
						tags.push(m(".tag.is-success", "Triton Setup"));

					return tags;
				},
				[activeDevice, deviceSettings]
			);
		},
		view: ({
			attrs: {
				activeDevice,
				activeDeviceId,
				deviceSettings,
				currentWorkspace
			}
		}) => [
			m(
				".level",
				m(".level-left", m(".level-item.tags", deviceTags())),
				activeDevice().location &&
					m(
						".level-right",
						m(
							".level.item",
							m(
								"button.button.is-small.is-link.is-rounded",
								{
									onclick: () => {
										let {
											datacenter,
											rack
										} = activeDevice().location;
										let workspaceRoute = m.route
											.get()
											.substring(
												0,
												m.route.get().indexOf("/", 1)
											);
										// clear activeDeviceId
										activeDeviceId(null);
										m.route.set(
											`${workspaceRoute}/datacenter/${
												datacenter.name
											}/rack/${
												rack.id
											}/device?highlightDeviceId=${
												activeDevice().id
											}`
										);
									}
								},
								"Show Device in Rack"
							)
						)
					)
			),
			m(
				"section.info-tiles",
				m(
					".tile.is-ancestor.has-text-centered",
					m(
						".tile.is-parent.is-vertical",
						m(
							"article.tile.is-child.box",
							m("p.subtitle", "Last Reported"),
							m(
								"p.title",
								activeDevice().last_seen
									? moment(activeDevice().last_seen).fromNow()
									: "never"
							)
						),
						m(
							"article.tile.is-child.box",
							m("p.subtitle", "Uptime"),
							m(
								"p.title",
								activeDevice().uptime_since
									? moment(
											activeDevice().uptime_since
									  ).fromNow(true)
									: "Unknown"
							)
						),
						m(
							"article.tile.is-child.box",
							m("p.subtitle", "BIOS Version"),
							m(
								"p.title",
								activeDevice().latest_report
									? activeDevice().latest_report.bios_version
									: "unknown"
							)
						)
					),
					m(
						".tile.is-parent",
						m(
							"article.tile.is-child.box",
							m("p.subtitle", "Time for Burn-in"),
							m(TimeToBurnin, {
								activeDevice,
								deviceSettings
							})
						)
					)
				)
			)
		]
	};
};

export default OverviewTab;
