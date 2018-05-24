import m from "mithril";
import stream from "mithril/stream";
import { request } from "mithril";

import { conchApi } from "config";

import Spinner from "../component/Spinner";

import RackLayout from "./RackLayout";
import RoomPanel from "./RoomPanel";

export default () => {
	let state = {};
	let rackFilterText = stream('')
	let rackRoleFilter = () => true;
	let activeRack;
	let rackLoading;

	return {
		oninit({ attrs: { currentWorkspace } }) {
			request({
				method: "GET",
				url: `${conchApi}/workspace/${currentWorkspace.id}/rack`,
				withCredentials: true,
			}).then(res => {
				// sort and assign the rack rooms
				state.rackRooms = Object.keys(res)
					.sort()
					.reduce((acc, name) => {
						let progress;
						let racks = res[name];
						if (
							racks.some(rack => rack["device_progress"]["FAIL"])
						) {
							progress = "failing";
						} else if (
							racks.some(rack => rack["device_progress"]["PASS"])
						) {
							progress = "passing";
						} else if (
							racks.some(rack => rack["device_progress"]["VALID"])
						) {
							progress = "validated";
						} else {
							progress = "not started";
						}
						acc.push({ name, racks, progress });
						return acc;
					}, []);
			});
		},
		view: ({ attrs: { currentWorkspace } }) => {
			return [
				m(
					"section.hero.is-primary.welcome.is-small",
					m(
						".hero-body",
						m("h1.title", "Datacenter Racks"),
						m("h2.subtitle", `Racks`)
					)
				),
				state.rackRooms == null
					? m("section.section", m(Spinner))
					: m(
							".columns.is-gapless",
							m(".column.is-3", m(RoomPanel, { state })),
							m(
								".column.is-3",
								state.activeRacks &&
									m(
										"nav.panel",
										m(
											"p.panel-heading",
											`${state.activeRoomName} Racks`
										),
										[
											m(
												".panel-block",
												m(
													"p.control.has-icons-left",
													m(
														"input.input.is-small[type=text][placeholder=Search Racks]",
														{
															oninput: m.withAttr(
																"value", rackFilterText
															),
														}
													),
													m(
														"span.icon.is-small.is-left",
														m("i.fas fa-search")
													)
												)
											),
											m(
												"p.panel-tabs",
												m(
													"a.is-active",
													{
														onclick: e => {
															e.target.parentElement.childNodes.forEach(
																e =>
																	e.classList.remove(
																		"is-active"
																	)
															);
															e.target.classList.add(
																"is-active"
															);
															//rackRoleFilter = () => true;
														},
													},
													"all"
												),
												m(
													"a",
													{
														onclick: e => {
															e.target.parentElement.childNodes.forEach(
																e =>
																	e.classList.remove(
																		"is-active"
																	)
															);
															e.target.classList.add(
																"is-active"
															);
															//rackRoleFilter = () => true;
														},
													},
													"validated"
												),
												m(
													"a",
													{
														onclick: e => {
															e.target.parentElement.childNodes.forEach(
																e =>
																	e.classList.remove(
																		"is-active"
																	)
															);
															e.target.classList.add(
																"is-active"
															);
															//rackRoleFilter = () => true;
														},
													},
													"failing"
												)
											),
											m(
												"p.panel-tabs",
												m(
													"a.is-active",
													{
														onclick: e => {
															e.target.parentElement.childNodes.forEach(
																e =>
																	e.classList.remove(
																		"is-active"
																	)
															);
															e.target.classList.add(
																"is-active"
															);
															rackRoleFilter = () =>
																true;
														},
													},
													"all"
												),
												Object.values(
													state.activeRacks
														.filter(
															rack =>
																rack.name.indexOf(
																	rackFilterText()
																) >= 0
														)
														.reduce((acc, rack) => {
															if (acc[rack.role])
																return acc;
															acc[rack.role] = m(
																"a",
																{
																	onclick: e => {
																		e.target.parentElement.childNodes.forEach(
																			e =>
																				e.classList.remove(
																					"is-active"
																				)
																		);
																		e.target.classList.add(
																			"is-active"
																		);
																		rackRoleFilter = role =>
																			role ===
																			rack.role;
																	},
																},
																rack.role.toLowerCase()
															);
															return acc;
														}, {})
												)
											),
											state.activeRacks.reduce(
												(acc, rack) => {
													if (
														rack.name.indexOf(
															rackFilterText()
														) >= 0 &&
														rackRoleFilter(
															rack.role
														)
													)
														acc.push(
															m(
																"a.panel-block",
																{
																	onclick: e => {
																		rackLoading = true;
																		request(
																			{
																				method:
																					"GET",
																				url: `${conchApi}/workspace/${
																					currentWorkspace.id
																				}/rack/${
																					rack.id
																				}`,
																				withCredentials: true,
																			}
																		).then(
																			res => {
																				activeRack = res;
																				rackLoading = false;
																			}
																		);
																		e.target.classList.add(
																			"is-active"
																		);
																	},
																},
																rack.name
															)
														);
													return acc;
												},
												[]
											),
										]
									)
							),
							m(
								".column.is-6",
								activeRack &&
									m(
										"nav.panel",
										m(
											"p.panel-heading",
											`${activeRack.name}`
										),
										m(
											"p.panel-tabs",
											m("a.is-active", "all"),
											m("a", "validated"),
											m("a", "failing")
										),
										rackLoading
											? m(Spinner)
											: m(RackLayout, {
													rack: activeRack,
											  })
									)
							)
					  ),
			];
		},
	};
};
