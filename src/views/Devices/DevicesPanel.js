import m from "mithril";
import stream from "mithril/stream";
import search from "fuzzysearch";

import Spinner from "../component/Spinner";
//import { ProgressIcon, rackToProgress } from "./Progress";

export default () => {
	const deviceFilterText = stream("");
	const deviceFilterTextLC = deviceFilterText.map(t => t.toLowerCase());
	const deviceTextFilter = device =>
		search(deviceFilterTextLC(), device.id.toLowerCase());

	//const selectedRole = stream("all");
	//const rackRoleFilter = role =>
	//selectedRole() === "all" || selectedRole() === role.toLowerCase();
	//let availableRackRoles;

	//const selectedProgress = stream("all");
	//const rackProgressFilter = rack =>
	//selectedProgress() === "all" ||
	//selectedProgress() === rackToProgress(rack);
	//let availableRackProgress;

	return {
		oninit: ({ attrs: { workspaceDevices } }) => {
			//// get the list of available rack roles
			//availableRackRoles = activeRacks.map(racks =>
			//Array.from(
			//racks.reduce((acc, rack) => {
			//acc.add(rack.role.toLowerCase());
			//return acc;
			//}, new Set(["all"]))
			//).sort()
			//);

			//availableRackProgress = activeRacks.map(racks =>
			//Array.from(
			//racks.reduce((acc, rack) => {
			//acc.add(rackToProgress(rack));
			//return acc;
			//}, new Set(["all"]))
			//).sort()
			//);

			// reset filters when activeRacks change
			workspaceDevices.map(() => {
				//selectedRole("all");
				//selectedProgress("all");
				deviceFilterText("");
			});
		},
		view: ({ attrs: { activeDeviceId, workspaceDevices } }) =>
			m(
				"nav.panel",
				m("p.panel-heading", `${workspaceDevices().length} Devices`),
				[
					m(
						".panel-block",
						m(
							"p.control.has-icons-left",
							m(
								"input.input.is-small[type=text][placeholder=Search Devices]",
								{
									oninput: m.withAttr(
										"value",
										deviceFilterText
									),
									value: deviceFilterText()
								}
							),
							m(
								"span.icon.is-small.is-left",
								m("i.fas fa-search")
							)
						)
					),
					m(
						"p.panel-tabs"
						//availableRackProgress().map(p =>
						//m(
						//"a",
						//{
						//onclick: e => {
						//selectedProgress(p);
						//},
						//// don't break spaces
						//style: "white-space:pre",
						//class: selectedProgress() === p && "is-active"
						//},
						//p
						//)
						//)
					),
					m(
						"p.panel-tabs"
						//availableRackRoles().map(r =>
						//m(
						//"a",
						//{
						//onclick: e => {
						//selectedRole(r);
						//},
						//class: selectedRole() === r && "is-active"
						//},
						//r
						//)
						//)
					),
					workspaceDevices().reduce((acc, device) => {
						if (
							deviceTextFilter(device)
							//rackRoleFilter(rack.role) &&
							//rackProgressFilter(rack)
						)
							acc.push(
								m(
									"a.panel-block",
									{
										onclick: e => {
											activeDeviceId(device.id);
										},
										class:
											activeDeviceId() === device.id &&
											"is-active"
									},
									//m(
									//".panel-icon",
									//m(ProgressIcon, {
									//progress: rackToProgress(rack)
									//})
									//),
									device.id
								)
							);
						return acc;
					}, [])
				]
			)
	};
};
