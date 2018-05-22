import m from "mithril";
import { request } from "mithril";
import { conchApi } from "config";

import { Spinner, ViewTitleHero } from "../component";

import RackProgress from "./RackProgress";

const StatusTile = {
	view: ({ children }) =>
		m(".tile.is-parent", m("article.tile.is-child.box", children)),
};

export default () => {
	let devices;
	let rackRooms;
	let rackCount;
	let failingValidations;
	let validationPlanIdToName;
	let validationsToShow = 10;
	let progress = { pass: 0, total: 0 };
	const progressPercent = () =>
		progress.total ? progress.pass / progress.total * 100 : 0;

	const validationToRow = validation => {
		return m(
			"tr",
			m("td[width=5%]", m("i.fa.fa-bell")),
			m("td", validation.device_id),
			m(
				"td",
				m(
					"span.has-text-grey-light",
					validationPlanIdToName[validation.validation_plan_id]
				)
			),
			m("td", m("a.button.is-small.is-primary", "Details"))
		);
	};

	const statusTiles = {
		view: () =>
			m(
				"section.info-tiles",
				m(
					".tile.is-ancestor.has-text-centered",
					m(
						StatusTile,
						m(
							`progress.progress.is-info[value=${progressPercent()}][max=100]`,
							`${progressPercent()}%`
						)
					)
				),
				m(
					".tile.is-ancestor.has-text-centered",
					m(
						StatusTile,
						rackCount == null
							? m(Spinner)
							: [
									m("p.title", rackCount),
									m("p.subtitle", "Racks"),
							  ]
					),
					m(
						StatusTile,
						devices == null
							? m(Spinner)
							: [
									m("p.title", devices.length),
									m("p.subtitle", "Devices"),
							  ]
					),
					m(
						StatusTile,
						failingValidations == null
							? m(Spinner)
							: [
									m("p.title", failingValidations.length),
									m("p.subtitle", "Validation Issues"),
							  ]
					)
				),
				failingValidations &&
					failingValidations.length > 0 &&
					validationPlanIdToName &&
					m(
						".tile.is-ancestor.has-text-centered",
						m(
							StatusTile,
							m(
								".card",
								m(
									"header.card-header",
									m(
										"p.card-header-title",
										"Device Validation Issues"
									)
								),
								m(
									".card-table",
									m(
										"table.table.is-fullwidth.is-striped",
										m(
											"thead",
											m(
												"tr",
												m("td"),
												m("td", "Device"),
												m("td", "Validation Plan"),
												m("td")
											)
										),
										m(
											"tbody",
											failingValidations
												.slice(0, validationsToShow)
												.map(validationToRow)
										)
									)
								),
								validationsToShow < failingValidations.length &&
									m(
										"footer.card-footer",
										m(
											"a.card-footer-item",
											{
												onclick: () => {
													validationsToShow =
														failingValidations.length;
												},
											},
											"View All"
										)
									)
							)
						)
					),
				m(
					".tile.is-ancestor.has-text-centered",
					m(
						StatusTile,
						m(
							"div.box",
							{
								style:
									"background-color:rgba(28%, 61%, 91%, 0.4)",
							},
							rackRooms == null
								? m(Spinner)
								: [
										m(
											"p.subtitle",
											"Rack Validation Status"
										),
										m(RackProgress, {
											rackRooms,
											group: "status",
										}),
								  ]
						)
					),
					m(
						StatusTile,
						m(
							"div.box",
							{
								style:
									"background-color:rgba(28%, 61%, 91%, 0.4)",
							},
							rackRooms == null
								? m(Spinner)
								: [
										m(
											"p.subtitle",
											"Validation Status by Role"
										),
										m(RackProgress, {
											rackRooms,
											group: "role",
										}),
								  ]
						)
					)
				)
			),
	};

	return {
		oninit({ attrs: { currentWorkspace } }) {
			request({
				method: "GET",
				url: `${conchApi}/workspace/${currentWorkspace.id}/device`,
				withCredentials: true,
			}).then(res => {
				devices = res.sort((a, b) => {
					if (a.id < b.id) {
						return -1;
					}
					if (a.id > b.id) {
						return 1;
					}
				});
				devices.forEach(device => {
					if (device.health === "PASS") progress.pass++;
					progress.total++;
				});
			});
			request({
				method: "GET",
				url: `${conchApi}/workspace/${currentWorkspace.id}/rack`,
				withCredentials: true,
			}).then(res => {
				// sort and assign the rack rooms
				rackCount = 0;
				rackRooms = Object.keys(res)
					.sort()
					.reduce((acc, room) => {
						acc[room] = res[room];
						rackCount += res[room].length;
						return acc;
					}, {});
			});
			request({
				method: "GET",
				url: `${conchApi}/workspace/${
					currentWorkspace.id
				}/validation_state?status=error,fail`,
				withCredentials: true,
			}).then(res => {
				failingValidations = res;
			});
			request({
				method: "GET",
				url: `${conchApi}/validation_plan`,
				withCredentials: true,
			}).then(res => {
				validationPlanIdToName = res.reduce((acc, validationPlan) => {
					acc[validationPlan.id] = validationPlan.name;
					return acc;
				});
			});
		},
		view({ attrs: { currentWorkspace } }) {
			return [
				m(ViewTitleHero, {
					title: "Conch Status",
					subtitle: `Status of current workspace`,
				}),
				m(statusTiles),
			];
		},
	};
};
