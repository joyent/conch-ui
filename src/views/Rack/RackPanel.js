import m from "mithril";
import stream from "mithril/stream";

import Spinner from "../component/Spinner";

export default () => {
	const rackFilterText = stream("");
	const roomNameFilter = roomName => roomName.indexOf(roomFilterText()) >= 0;
	const rackProgressFilter = stream(() => true);
	let rackRoleFilter = () => true;
	return {
		view: ({ attrs: { activeRoomName, activeRacks, activeRack } }) =>
			m("nav.panel", m("p.panel-heading", `${activeRoomName()} Racks`), [
				m(
					".panel-block",
					m(
						"p.control.has-icons-left",
						m(
							"input.input.is-small[type=text][placeholder=Search Racks]",
							{
								oninput: m.withAttr("value", rackFilterText),
							}
						),
						m("span.icon.is-small.is-left", m("i.fas fa-search"))
					)
				),
				m(
					"p.panel-tabs",
					m(
						"a.is-active",
						{
							onclick: e => {
								e.target.parentElement.childNodes.forEach(e =>
									e.classList.remove("is-active")
								);
								e.target.classList.add("is-active");
							},
						},
						"all"
					),
					m(
						"a",
						{
							onclick: e => {
								e.target.parentElement.childNodes.forEach(e =>
									e.classList.remove("is-active")
								);
								e.target.classList.add("is-active");
							},
						},
						"validated"
					),
					m(
						"a",
						{
							onclick: e => {
								e.target.parentElement.childNodes.forEach(e =>
									e.classList.remove("is-active")
								);
								e.target.classList.add("is-active");
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
								e.target.parentElement.childNodes.forEach(e =>
									e.classList.remove("is-active")
								);
								e.target.classList.add("is-active");
								rackRoleFilter = () => true;
							},
						},
						"all"
					),
					Object.values(
						activeRacks()
							.filter(
								rack => rack.name.indexOf(rackFilterText()) >= 0
							)
							.reduce((acc, rack) => {
								if (acc[rack.role]) return acc;
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
											e.target.classList.add("is-active");
											rackRoleFilter = role =>
												role === rack.role;
										},
									},
									rack.role.toLowerCase()
								);
								return acc;
							}, {})
					)
				),
				activeRacks().reduce((acc, rack) => {
					if (
						rack.name.indexOf(rackFilterText()) >= 0 &&
						rackRoleFilter(rack.role)
					)
						acc.push(
							m(
								"a.panel-block",
								{
									onclick: e => {
										activeRack(rack);
									},
									class:
										activeRack() &&
										activeRack().id === rack.id &&
										"is-active",
								},
								rack.name
							)
						);
					return acc;
				}, []),
			]),
	};
};
