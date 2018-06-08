import m from "mithril";
import stream from "mithril/stream";
import search from "fuzzysearch";

import Spinner from "../component/Spinner";
import { ProgressIcon, rackToProgress } from "./Progress";

export default () => {
	const rackFilterText = stream("");
	const rackFilterTextLC = rackFilterText.map(t => t.toLowerCase());
	const rackNameFilter = rackName =>
		search(rackFilterTextLC(), rackName.toLowerCase());

	const selectedRole = stream("all");
	const rackRoleFilter = role =>
		selectedRole() === "all" || selectedRole() === role.toLowerCase();
	let availableRackRoles;

	const selectedProgress = stream("all");
	const rackProgressFilter = rack =>
		selectedProgress() === "all" ||
		selectedProgress() === rackToProgress(rack);
	let availableRackProgress;

	return {
		oninit: ({ attrs: { activeRacks } }) => {
			// get the list of available rack roles
			availableRackRoles = activeRacks.map(racks =>
				Array.from(
					racks.reduce((acc, rack) => {
						acc.add(rack.role.toLowerCase());
						return acc;
					}, new Set(["all"]))
				).sort()
			);

			availableRackProgress = activeRacks.map(racks =>
				Array.from(
					racks.reduce((acc, rack) => {
						acc.add(rackToProgress(rack));
						return acc;
					}, new Set(["all"]))
				).sort()
			);

			// reset filters when activeRacks change
			activeRacks.map(() => {
				selectedRole("all");
				selectedProgress("all");
				rackFilterText("");
			});
		},
		view: ({ attrs: { activeRoomName, activeRacks, activeRackId } }) =>
			m("nav.panel", m("p.panel-heading", `${activeRoomName()} Racks`), [
				m(
					".panel-block",
					m(
						"p.control.has-icons-left",
						m(
							"input.input.is-small[type=text][placeholder=Search Racks]",
							{
								oninput: m.withAttr("value", rackFilterText),
								value: rackFilterText()
							}
						),
						m("span.icon.is-small.is-left", m("i.fas fa-search"))
					)
				),
				m(
					"p.panel-tabs",
					availableRackProgress().map(p =>
						m(
							"a",
							{
								onclick: e => {
									selectedProgress(p);
								},
								// don't break spaces
								style: "white-space:pre",
								class: selectedProgress() === p && "is-active"
							},
							p
						)
					)
				),
				m(
					"p.panel-tabs",
					availableRackRoles().map(r =>
						m(
							"a",
							{
								onclick: e => {
									selectedRole(r);
								},
								class: selectedRole() === r && "is-active"
							},
							r
						)
					)
				),
				activeRacks().reduce((acc, rack) => {
					if (
						rackNameFilter(rack.name) &&
						rackRoleFilter(rack.role) &&
						rackProgressFilter(rack)
					)
						acc.push(
							m(
								"a.panel-block",
								{
									onclick: e => {
										activeRackId(rack.id);
									},
									class:
										activeRackId() === rack.id &&
										"is-active"
								},
								m(
									".panel-icon",
									m(ProgressIcon, {
										progress: rackToProgress(rack)
									})
								),
								rack.name
							)
						);
					return acc;
				}, [])
			])
	};
};
