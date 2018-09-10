import m from "mithril";
import stream from "mithril/stream";
import Request from "util/Request";

import { Spinner, ViewTitleHero } from "views/component";

import DeviceModal from "views/DeviceModal";
import RackProgress from "views/Status/RackProgress";

const StatusTile = {
	view: ({ children }) =>
		m(".tile.is-parent", m("article.tile.is-child.box", children))
};

export default () => {
	const devices = stream();
	const activeDeviceId = stream();

	let rackRooms;
	let rackCount;
	let failingValidations;
	let validationPlanIdToName = {};
	let validationsToShow = 10;

	const progress = stream({});
	const progressPercent = progress.map(
		p => (p.total ? p.pass / p.total * 100 : 0)
	);

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
			m(
				"td",
				m(
					"a.button.is-small.is-primary",
					{
						onclick() {
							activeDeviceId(validation.device_id);
						}
					},
					"View Device"
				)
			)
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
									m("p.subtitle", "Racks")
							  ]
					),
					m(
						StatusTile,
						devices() == null
							? m(Spinner)
							: [
									m("p.title", devices().length),
									m("p.subtitle", "Devices")
							  ]
					),
					m(
						StatusTile,
						failingValidations == null
							? m(Spinner)
							: [
									m("p.title", failingValidations.length),
									m("p.subtitle", "Validation Issues")
							  ]
					)
				),
				m(
					".tile.is-ancestor.has-text-centered",
					m(
						StatusTile,
						failingValidations == null
							? m(Spinner)
							: failingValidations.length == 0
								? m("p.subtitle", "No Validation Failures")
								: m(
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
											{
												style:
													"max-height: 600px; overflow: auto;"
											},
											m(
												"table.table.is-narrow.is-fullwidth.is-striped",
												m(
													"thead",
													m(
														"tr",
														m("th"),
														m("th", "Device"),
														m(
															"th",
															"Validation Plan"
														),
														m("th")
													)
												),
												m(
													"tbody",
													failingValidations
														.slice(
															0,
															validationsToShow
														)
														.map(validationToRow)
												)
											)
										),
										validationsToShow <
											failingValidations.length &&
											m(
												"footer.card-footer",
												m(
													"a.card-footer-item",
													{
														onclick: () => {
															validationsToShow =
																failingValidations.length;
														}
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
									"background-color:rgba(28%, 61%, 91%, 0.4)"
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
											group: "status"
										})
								  ]
						)
					),
					m(
						StatusTile,
						m(
							"div.box",
							{
								style:
									"background-color:rgba(28%, 61%, 91%, 0.4)"
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
											group: "role"
										})
								  ]
						)
					)
				)
			)
	};

	const r = new Request();
	return {
		oninit({ attrs: { currentWorkspace } }) {
			currentWorkspace.map(({ id }) => {
				devices(null);
				r
					.request({
						method: "GET",
						url: `/workspace/${id}/device`
					})
					.then(res => {
						devices(
							res.sort((a, b) => {
								if (a.id < b.id) {
									return -1;
								}
								if (a.id > b.id) {
									return 1;
								}
							})
						);
						const newProgress = { pass: 0, total: 0 };
						devices().forEach(device => {
							if (device.health === "PASS") newProgress.pass++;
							newProgress.total++;
						});
						progress(newProgress);
					});

				rackCount = null;
				rackRooms = null;
				r
					.request({
						method: "GET",
						url: `/workspace/${id}/rack`
					})
					.then(res => {
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

				failingValidations = null;
				r
					.request({
						method: "GET",
						url: `/workspace/${id}/validation_state?status=error,fail`
					})
					.then(res => {
						failingValidations = res;
					});

				r
					.request({
						method: "GET",
						url: "/validation_plan"
					})
					.then(res => {
						validationPlanIdToName = res.reduce(
							(acc, validationPlan) => {
								acc[validationPlan.id] = validationPlan.name;
								return acc;
							},
							{}
						);
					});
			});

			m.route.param("deviceId") &&
				activeDeviceId(m.route.param("deviceId"));
			activeDeviceId.map(deviceId => {
				const route = m.route.get();
				const routePrefix = route.substring(
					0,
					route.indexOf("/status")
				);

				let [_, queryS] = route.split("?");
				queryS ? (queryS = `?${queryS}`) : (queryS = "");

				if (deviceId)
					m.route.set(
						`${routePrefix}/status/device/${deviceId}${queryS}`
					);
				else m.route.set(`${routePrefix}/status`);
			});
		},
		view({ attrs: { currentWorkspace } }) {
			return [
				m(ViewTitleHero, {
					title: `${currentWorkspace().name} workspace status`,
					subtitle: "Overview of workspace build progress"
				}),
				m(statusTiles),
				activeDeviceId() && m(DeviceModal, { activeDeviceId })
			];
		}
	};
};
