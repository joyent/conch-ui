import m from "mithril";
import sortBy from "lodash/sortBy";
import stream from "mithril/stream";
import countBy from "lodash/countBy";
import groupBy from "lodash/groupBy";

import { Spinner } from "views/component";

import Request from "util/Request";
import Device from "models/Device";
import Validations from "models/Validations";

const ValidationRow = () => {
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
					m(
						".icon",
						revealDetails
							? m("i.fas.fa-caret-down")
							: m("i.fas.fa-caret-right")
					)
				),
				m("td.has-text-centered", resultsToCountTags(results)),
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
					m("td"),
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
										m("th", "Order"),
										m("th", "Results"),
										m("th", "Message"),
										m("th", "Hint")
									)
								),
								m(
									"tbody",
									sortBy(results, "order").map(result =>
										m(
											"tr",
											{
												class:
													result.status !== "pass" &&
													"has-background-warning has-text-dark"
											},
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
	const headers = [
		m("th", ""),
		m("th", "Status"),
		m("th", "Name"),
		m("th", "Description")
	];
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
			activeDevice.map(d => {
				const device = new Device(d.id);
				const validationList = new Validations();

				device.getDeviceValidations().then(validationStates);
				validationList.get().then(validations);
			});
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
									m(ValidationRow, {
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

export default ValidationTab;
