import m from "mithril";
import { request } from "mithril";

import { conchApi } from "config";

import Spinner from "../component/Spinner";
import ProgressIcon from "./ProgressIcon";

// ok to not be component because they don't change
const headers = [
	m("th", "Slot"),
	m("th", ""),
	m("th", "Product Name"),
	m("th", "Occupant")
];

const OccupantEntry = {
	view({ attrs: { occupant } }) {
		if (!occupant) {
			return m(
				"button.button.is-primary.is-outlined.is-small",
				"Add Device"
			);
		}
		return [
			occupant.id,
			occupant.asset_tag &&
				m("span.has-text-grey", ` ${occupant.asset_tag}`)
		];
	}
};

export default {
	view: ({ attrs: { deviceSlots, activeDeviceId } }) => {
		return m(
			"table.table.is-fullwidth.is-hoverable",
			m("thead", m("tr", headers)),
			m("tfoot", m("tr", headers)),
			m(
				"tbody",
				deviceSlots().map(slot => {
					let occupant = slot.occupant;
					return m(
						"tr",
						{
							onclick() {
								slot.occupant &&
									activeDeviceId(slot.occupant.id);
							},
							style: slot.occupant && "cursor: pointer"
						},
						m("th", slot.id),
						m(
							"td",
							m(
								"p",
								m(ProgressIcon, {
									progress: slot.progress
								})
							)
						),
						m("td", slot.name),
						m("td", m(OccupantEntry, { occupant }))
					);
				})
			)
		);
	}
};
