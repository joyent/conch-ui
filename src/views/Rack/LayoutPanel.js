import m from "mithril";
import stream from "mithril/stream";
import search from "fuzzysearch";

import Spinner from "../component/Spinner";

import LayoutTable from "./LayoutTable";
import EditLayoutModal from "./EditLayoutModal";

const deviceProgress = device => {
	if (device == null) return "unassigned";
	if (device.validated) return "validated";
	if (device.health.toLowerCase() === "fail") return "failing";
	return "in progress";
};

export default () => {
	const deviceSearchText = stream("");
	const deviceSearchTextLC = deviceSearchText.map(t => t.toLowerCase());
	const selectedProgress = stream("all");
	let availableDeviceProgress;
	let normalizedSlots;
	let filteredSlots;

	// filter devices by selected progress and search text. Search texts tries
	// to match against device ID, device asset tag
	const deviceFilter = stream.combine(
		(progress, searchText) => occupant => {
			const deviceId = occupant ? occupant.id.toLowerCase() : "";
			const assetTag =
				occupant && occupant.asset_tag
					? occupant.asset_tag.toLowerCase()
					: "";
			const progressFilter =
				progress() === "all" || progress() === deviceProgress(occupant);
			const searchFilter =
				search(searchText(), deviceId) ||
				search(searchText(), assetTag);
			return progressFilter && searchFilter;
		},
		[selectedProgress, deviceSearchTextLC]
	);

	const editLayout = stream();

	return {
		oninit: ({ attrs: { rackLayout } }) => {
			// reset filters when rackLayout changes
			rackLayout.map(() => {
				deviceSearchText("");
				selectedProgress("all");
			});

			// get the set of device progresses
			availableDeviceProgress = rackLayout.map(layout =>
				Array.from(
					Object.keys(layout.slots || {}).reduce((acc, slotId) => {
						let occupant = rackLayout().slots[slotId].occupant;
						if (occupant == null) acc.add("unassigned");
						else acc.add(deviceProgress(occupant));
						return acc;
					}, new Set(["all"]))
				).sort()
			);

			// filter the slots based on the evaluation of deviceFilter and
			// transform the layout into an array of objects in the form
			// {id: slotId, name: productName, occupant: occupant }
			normalizedSlots = rackLayout.map(layout => {
				return Object.keys(layout.slots || {})
					.reverse()
					.map(slotId => {
						let slot = rackLayout().slots[slotId];
						let occupant = slot.occupant;
						return {
							id: slotId,
							name: slot.name,
							progress: occupant
								? deviceProgress(occupant)
								: "unassigned",
							occupant: occupant
						};
					});
			});
			filteredSlots = stream.combine(
				(slots, filter) =>
					slots().filter(slot => filter()(slot.occupant)),
				[normalizedSlots, deviceFilter]
			);
		},
		view: ({
			attrs: {
				currentWorkspace,
				activeRack,
				rackLoading,
				rackLayout,
				activeDeviceId
			}
		}) => [
			m(
				"nav.panel",
				m(".panel-heading", `Rack ${activeRack().name}`),
				m(
					".panel-block",
					m(
						"p.control.has-icons-left",
						m(
							"input.input.is-small[type=text][placeholder=Search Devices]",
							{
								oninput: m.withAttr("value", deviceSearchText),
								value: deviceSearchText()
							}
						),
						m("span.icon.is-small.is-left", m("i.fas fa-search"))
					)
				),
				m(
					"p.panel-tabs",
					availableDeviceProgress().map(p =>
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
					".panel-block",
					m(
						"button.button.is-primary.is-outlined.is-fullwidth.is-small",
						{
							onclick() {
								editLayout(true);
							}
						},
						"Edit Assignments"
					)
				),
				rackLoading()
					? m(Spinner)
					: m(LayoutTable, {
							deviceSlots: filteredSlots,
							activeDeviceId: activeDeviceId
					  })
			),
			editLayout() &&
				m(EditLayoutModal, {
					deviceSlots: normalizedSlots,
					activeRack,
					currentWorkspace,
					editLayout
				})
		]
	};
};
