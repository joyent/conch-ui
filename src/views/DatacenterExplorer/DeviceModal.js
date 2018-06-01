import m from "mithril";
import stream from "mithril/stream";
import moment from "moment";
import { request } from "mithril";

import { conchApi } from "config";

import { Spinner } from "../component/";

const Tabs = () => {
	const activeTab = stream();
	return {
		oninit: ({ attrs: { tabs } }) => {
			activeTab(tabs[0]);
		},
		view: ({ attrs: { tabs, activeDevice } }) => {
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
				activeTab().component &&
					m(activeTab().component, { activeDevice })
			];
		}
	};
};

const OverviewTab = () => {
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
		view: ({ attrs: { activeDevice } }) => [
			m(".tags", deviceTags()),
			m(
				"section.info-tiles",
				m(
					".tile.is-ancestor.has-text-centered",
					m(
						".tile.is-parent",
						m(
							"article.tile.is-child.box",
							m("p.subtitle", "Last Seen"),
							m(
								"p.title",
								activeDevice().last_seen
									? moment(activeDevice().last_seen).fromNow()
									: "never"
							)
						)
					),
					m(
						".tile.is-parent",
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
					)
				)
			)
		]
	};
};

const ValidationTab = () => {
	const headers = [
		m("th", "Category"),
		m("th", "Name"),
		//m("th", "Status"),
		m("th.has-text-right", "Message")
		//m("th", "Hint")
	];
	const validationStates = stream();
	const validations = stream();
	const validationIdToName = validations.map(vs => {
		let map = vs.reduce((acc, v) => {
			acc[v.id] = v.name;
			return acc;
		}, {});
		return id => map[id];
	});

	return {
		oninit: ({ attrs: { activeDevice } }) => {
			request({
				method: "GET",
				url: `${conchApi}/device/${activeDevice().id}/validation_state`,
				withCredentials: true
			}).then(validationStates);
			request({
				method: "GET",
				url: `${conchApi}/validation`,
				withCredentials: true
			}).then(validations);
		},
		view: ({ attrs: { activeDevice } }) => {
			return stream.merge([validationStates, validations])() == null
				? m(Spinner)
				: m(
						"table.table.is-narrow.is-marginless.is-hoverable",
						m("thead", m("tr", headers)),
						m("tfoot", m("tr", headers)),
						validationStates().map(validationState =>
							m(
								"tbody",
								validationState.results.map(r =>
									m(
										"tr",
										m("td", r.category),
										m(
											"td",
											validationIdToName()(
												r.validation_id
											)
										),
										//m("td", r.status),
										//m("td", r.hint),
										m("td.has-text-right", r.message)
									)
								)
							)
						)
				  );
		}
	};
};

export default () => {
	return {
		oninit: ({ attrs: { activeDevice } }) => {},
		view: ({ attrs: { activeDeviceId, activeDevice, deviceLoading } }) => {
			return m(
				".modal.is-active.is-size-6",
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
												component: OverviewTab
											},
											{
												title: "Validation",
												component: ValidationTab
											},
											{
												title: "Hardware",
												component: null
											},
											{
												title: "Networking",
												component: null
											},
											{
												title: "Location",
												component: null
											},
											{ title: "Report", component: null }
										],
										activeDevice
									})
							  ]
					),
					m("footer.modal-card-foot.is-right")
				)
			);
		}
	};
};
