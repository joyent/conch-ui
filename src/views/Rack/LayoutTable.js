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
	m("th", "Occupant"),
];

const deviceProgress = device => {
	if (device.validated) return "validated";
	if (device.health.toLowerCase() === "fail") return "failing";
	if (device.health.toLowerCase() === "pass") return "failing";
	return "in progress";
};

export default {
	view: ({ attrs: { rackLayout } }) => {
		return m(
			"table.table.is-fullwidth.is-hoverable",
			m("thead", m("tr", headers)),
			m("tfoot", m("tr", headers)),
			m(
				"tbody",
				Object.keys(rackLayout().slots || {})
					.reverse()
					.map(slotId => {
						let slot = rackLayout().slots[slotId];
						let occupant = slot.occupant;
						return m(
							"tr",
							m("th", slotId),
							m(
								"th",
								occupant &&
									m(ProgressIcon, {
										progress: deviceProgress(occupant),
									})
							),
							m("td", slot.name),
							m(
								"td",
								occupant && [
									occupant.id,
									occupant.asset_tag &&
										m(
											"span.has-text-grey",
											` ${slot.occupant.asset_tag}`
										),
								]
							)
						);
					})
			)
		);
	},
};
