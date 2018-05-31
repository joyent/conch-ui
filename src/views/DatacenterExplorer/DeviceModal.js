import m from "mithril";
import stream from "mithril/stream";
import moment from "moment";

import ProgressIcon from "./ProgressIcon";

import { Spinner } from "../component/";

const Tabs = () => {
	const activeTab = stream();
	return {
		oninit: ({ attrs: { tabs } }) => {
			activeTab(tabs[0]);
		},
		view: ({ attrs: { tabs } }) => {
			return [
				m(
					".tabs.is-centered.is-boxed.is-small",
					m(
						"ul",
						tabs.map(tab =>
							m(
								"li",
								{
									class:
										activeTab().title === tab.title &&
										"is-active",
									onclick() {
										activeTab(tab);
									}
								},
								m("a", tab.title)
							)
						)
					)
				),
				activeTab().vnode
			];
		}
	};
};

export default () => {
	let deviceTags;

	return {
		oninit: ({ attrs: { activeDevice } }) => {
			deviceTags = activeDevice.map(device => {
				let tags = [];
				if (device.health.toLowerCase() === "fail")
					tags.push(m(".tag.is-danger", "Failing Validaiton"));
				else if (device.health.toLowerCase() === "pass")
					tags.push(m(".tag.is-info", "Passing Validation"));
				else if (device.health.toLowerCase() === "unknown")
					tags.push(m(".tag.is-warning", "No report"));

				if (device.validated)
					tags.push(m(".tag.is-success", "Validated"));
				if (device.graduated)
					tags.push(m(".tag.is-success", "Graduated"));
				if (device.triton_setup)
					tags.push(m(".tag.is-success", "Triton Setup"));

				return tags;
			});
		},
		view: ({ attrs: { activeDeviceId, activeDevice, deviceLoading } }) => {
			return m(
				".modal.is-active",
				m(".modal-background", {
					onclick() {
						activeDeviceId(null);
					}
				}),
				m(
					".modal-card",
					m(
						"header.modal-card-head",
						m("p.modal-card-title", `Device ${activeDeviceId()}`),
						m("button.delete[aria-label=close]", {
							onclick() {
								activeDeviceId(null);
							}
						})
					),
					m(
						"section.modal-card-body",
						deviceLoading()
							? m(Spinner)
							: [
									m(Tabs, {
										tabs: [
											{
												title: "Overview",
												vnode: [
													m(".tags", deviceTags()),
													m(
														"section.info-tiles",
														m(
															".tile.is-ancestor.has-text-centered",
															m(
																".tile.is-parent",
																m(
																	"article.tile.is-child.box",
																	m(
																		"p.subtitle",
																		"Last Seen"
																	),
																	m(
																		"p.title",
																		activeDevice()
																			.last_seen
																			? moment(
																					activeDevice()
																						.last_seen
																			  ).fromNow()
																			: "never"
																	)
																)
															),
															m(
																".tile.is-parent",
																m(
																	"article.tile.is-child.box",
																	m(
																		"p.subtitle",
																		"BIOS Version"
																	),
																	m(
																		"p.title",
																		activeDevice()
																			.latest_report
																			? activeDevice()
																					.latest_report
																					.bios_version
																			: "unknown"
																	)
																)
															)
														)
													)
												]
											},
											{
												title: "Validation",
												vnode: null
											},
											{ title: "Hardware", vnode: null },
											{
												title: "Networking",
												vnode: null
											},
											{ title: "Location", vnode: null },
											{ title: "Report", vnode: null }
										]
									})
							  ]
					),
					m("footer.modal-card-foot.is-right")
				)
			);
		}
	};
};
