import m from "mithril";
import { request } from "mithril";

import { conchApi } from "config";

import Spinner from "../component/Spinner";

import RackLayout from "./RackLayout";

export default () => {
	let state = {};
	let rackCount;
	let rackRooms;
	let activeRoom;
	let activeRoomName;
	let roomFilterText = "";
	let rackFilterText = "";
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
				rackCount = 0;
				rackRooms = Object.keys(res)
					.sort()
					.reduce((acc, room) => {
						acc[room] = res[room];
						rackCount += res[room].length;
						return acc;
					}, {});
			});
		},
		view: ({ attrs: { currentWorkspace } }) => [
			m(
				"section.hero.is-primary.welcome.is-small",
				m(
					".hero-body",
					m("h1.title", "Datacenter Racks"),
					m("h2.subtitle", `Racks`)
				)
			),
			rackRooms == null
				? m("section.section", m(Spinner))
				: m(
						".columns.is-gapless",
						m(
							".column.is-3",
							m(
								"nav.panel",
								m("p.panel-heading", "Datacenter Rooms"),
								m(
									".panel-block",
									m(
										"p.control.has-icons-left",
										m(
											"input.input.is-small[type=text][placeholder=Search Rooms]",
											{
												oninput: m.withAttr(
													"value",
													v => {
														roomFilterText = v;
													}
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
									m("a.is-active", "all"),
									m("a", "validated"),
									m("a", "failing")
								),
								Object.keys(rackRooms).reduce(
									(acc, rackRoom) => {
										if (
											rackRoom.indexOf(roomFilterText) >=
											0
										)
											acc.push(
												m(
													"a.panel-block",
													{
														onclick: e => {
															activeRoomName = rackRoom;
															activeRoom =
																rackRooms[
																	rackRoom
																];
															e.target.classList.add(
																"is-active"
															);
														},
													},
													rackRoom
												)
											);
										return acc;
									},
									[]
								)
							)
						),
						m(
							".column.is-3",
							activeRoom &&
								m(
									"nav.panel",
									m(
										"p.panel-heading",
										`${activeRoomName} Racks`
									),
									rackRooms == null
										? m(Spinner)
										: [
												m(
													".panel-block",
													m(
														"p.control.has-icons-left",
														m(
															"input.input.is-small[type=text][placeholder=Search Racks]",
															{
																oninput: m.withAttr(
																	"value",
																	v => {
																		rackFilterText = v;
																	}
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
														activeRoom
															.filter(
																rack =>
																	rack.name.indexOf(
																		rackFilterText
																	) >= 0
															)
															.reduce(
																(acc, rack) => {
																	if (
																		acc[
																			rack
																				.role
																		]
																	)
																		return acc;
																	acc[
																		rack.role
																	] = m(
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
																},
																{}
															)
													)
												),
												activeRoom.reduce(
													(acc, rack) => {
														if (
															rack.name.indexOf(
																rackFilterText
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
									m("p.panel-heading", `${activeRack.name}`),
									m(
										"p.panel-tabs",
										m("a.is-active", "all"),
										m("a", "validated"),
										m("a", "failing")
									),
									rackLoading
										? m(Spinner)
										: m(RackLayout, { rack: activeRack })
								)
						)
				  ),
		],
	};
};
