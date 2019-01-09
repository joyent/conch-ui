import m from "mithril";
import stream from "mithril/stream";

import Spinner from "views/component/Spinner";
import { ProgressIcon } from "views/DatacenterBrowser/Progress";

import Workspace from "models/Workspace";
import Device from "models/Device";

const SaveEditButton = {
	view: ({
		attrs: {
			activeRack,
			assignments,
			currentWorkspace,
			duplicateSerials,
			editLayout
		}
	}) =>
		m(
			"button.button.is-fullwidth.is-primary",
			{
				onclick(e) {
					const layout = {};
					const duplicates = {};
					Object.keys(assignments).forEach(slot => {
						if (layout[assignments[slot].id]) {
							duplicates[slot] = true;
							duplicates[layout[assignments[slot].id]] = true;
						}
						layout[assignments[slot].id] = slot;
					});
					duplicateSerials(duplicates);
					if (Object.keys(duplicateSerials()).length === 0) {
						e.target.classList.add("is-loading");
						const workspace = currentWorkspace();
						workspace
							.setRackLayout(activeRack().id, layout)
							.then(res => {
								Promise.all(
									Object.values(assignments).map(a => {
										if (!a.assetTag)
											return Promise.resolve();

										const device = new Device(a.id);
										return device.setAssetTag(a.assetTag);
									})
								).then(() => {
									editLayout(false);
									activeRack(activeRack());
									m.redraw();
								});
							});
					}
				}
			},
			"Save"
		)
};

const EditLayoutTable = () => {
	const assignments = {};
	const duplicateSerials = stream({});

	// ok to not be component because they don't change
	const headers = [
		m("th", "Slot"),
		m("th", "Product Name"),
		m("th.has-text-right", "Device Identification")
	];

	return {
		oninit: ({ attrs: { deviceSlots } }) => {
			deviceSlots().map(slot => {
				let occupant = slot.occupant;
				if (occupant) {
					assignments[slot.id] = {
						id: occupant.id,
						assetTag: occupant.asset_tag
					};
				}
			});
		},
		view: ({
			attrs: { deviceSlots, currentWorkspace, editLayout, activeRack }
		}) => {
			const saveButton = m(SaveEditButton, {
				activeRack,
				assignments,
				currentWorkspace,
				duplicateSerials,
				editLayout
			});
			return [
				saveButton,
				m(
					"table.table.is-fullwidth.is-marginless",
					{ id: "edit-layout-table" },
					m("thead", m("tr", headers)),
					m("tfoot", m("tr", headers)),
					m(
						"tbody",
						deviceSlots().map(slot => {
							return m(
								"tr",
								m("th", slot.id),
								m("td", slot.name),
								m(
									"td.has-text-right",
									m(
										".control.has-icons-left",
										m(
											"input.input.is-small[type=text][placeholder=Serial Number]",
											{
												pattern: "[a-zA-Z0-9]+",
												value:
													assignments[slot.id] &&
													assignments[slot.id].id,
												oninput: m.withAttr(
													"value",
													value => {
														let assignment =
															assignments[
																slot.id
															] || {};
														if (value === "")
															delete assignments[
																slot.id
															];
														else {
															assignment.id = value;
															assignments[
																slot.id
															] = assignment;
														}
													}
												)
											}
										),
										m(
											"span.icon.is-left",
											m("i.fas.fa-barcode")
										),
										duplicateSerials()[slot.id] &&
											m(
												"p.help.is-danger",
												"Device serial is duplicated"
											)
									),
									m(
										".control.has-icons-left",
										m(
											"input.input.is-small[type=text][placeholder=Asset Tag]",
											{
												pattern: "[a-zA-Z0-9]+",
												value:
													assignments[slot.id] &&
													assignments[slot.id]
														.assetTag,
												oninput: m.withAttr(
													"value",
													value => {
														assignments[
															slot.id
														].assetTag = value;
													}
												),
												disabled:
													assignments[slot.id] == null
											}
										),
										m(
											"span.icon.is-left",
											m("i.fas.fa-tag")
										)
									)
								)
							);
						})
					)
				),
				saveButton
			];
		}
	};
};

export default {
	view: ({ attrs }) => {
		return m(
			".modal.is-active",
			{ id: "device-editor-modal" },
			m(".modal-background", {
				onclick() {
					attrs.editLayout(false);
				}
			}),
			m(
				".modal-card",
				m(
					"header.modal-card-head",
					m(
						"p.modal-card-title",
						`Assign Rack ${attrs.activeRack().name}`
					),
					m("button.delete[aria-label=close]", {
						onclick() {
							attrs.editLayout(false);
						}
					})
				),
				m("section.modal-card-body", m(EditLayoutTable, attrs))
			)
		);
	}
};
