import m from "mithril";
import moment from "moment";
import sortBy from "lodash/sortBy";
import groupBy from "lodash/groupBy";
import countBy from "lodash/countBy";
import stream from "mithril/stream";
import { request } from "mithril";

import { conchApi } from "config";

import { Spinner } from "../component/";
import { ProgressIcon } from "./Progress";

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

const ValidationRows = () => {
	let revealDetails = false;
	const resultsToCountTags = results => {
		const counts = countBy(results, "status");
		const statusToColor = status => {
			switch (status) {
				case "fail":
					return "is-warning";
				case "error":
					return "is-danger";
				default:
					return "is-info";
			}
		};
		return Object.keys(counts).map(status =>
			m("span.tag", { class: statusToColor(status) }, counts[status])
		);
	};
	return {
		view: ({ attrs: { validation, results } }) => [
			m(
				"tr",
				{
					onclick() {
						revealDetails = !revealDetails;
					},
					class: revealDetails && "is-selected",
					style: "cursor: pointer"
				},
				m(
					"td",
					resultsToCountTags(results)
					//m(ProgressIcon, {
					//progress: "validated"
					//})
				),
				m("td", validation.name),
				m(
					"td",
					validation.description ||
						m("span.has-text-grey", "No Description")
				)
			),
			revealDetails &&
				m(
					"tr",
					m(
						"td[colspan=3]",
						m(
							".content",
							m(
								"table.table.is-narrow.is-marginless.is-fullwidth",
								m(
									"thead",
									m(
										"tr",
										m("th"),
										m("th", "Status"),
										m("th", "Message"),
										m("th", "Hint")
									)
								),
								m(
									"tbody",
									sortBy(results, "order").map(result =>
										m(
											"tr",
											m("td", result.order + 1),
											m("td", result.status),
											m("td", result.message),
											m(
												"td",
												result.hint ||
													m(
														"span.has-text-grey",
														"No Hint"
													)
											)
										)
									)
								)
							)
						)
					)
				)
		]
	};
};

const ValidationTab = () => {
	const headers = [m("th", ""), m("th", "Name"), m("th", "Description")];
	const validationStates = stream();
	const validations = stream();

	// group results by validation
	const groupedValidationStateResults = validationStates.map(states =>
		states.map(state => groupBy(state.results, "validation_id"))
	);
	const idToValidation = validations.map(vs => {
		let map = vs.reduce((acc, v) => {
			acc[v.id] = v;
			return acc;
		}, {});
		return id => map[id];
	});

	const revealDetails = {};

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
						"table.table.is-narrow.is-marginless.is-fullwidth",
						m("thead", m("tr", headers)),
						m("tfoot", m("tr", headers)),
						groupedValidationStateResults().map(groupedResults => {
							return m(
								"tbody",
								sortBy(
									Object.keys(groupedResults),
									vid => idToValidation()(vid).name
								).map(vid =>
									m(ValidationRows, {
										results: groupedResults[vid],
										validation: idToValidation()(vid)
									})
								)
							);
						})
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
												title: "Settings",
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
