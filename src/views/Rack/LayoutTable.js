import m from "mithril";
import { request } from "mithril";

import { conchApi } from "config";

import Spinner from "../component/Spinner";

const headers = [m("th", "Slot"), m("th", "Product Name"), m("th", "Occupant")];

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
						return m(
							"tr",
							m("th", slotId),
							m("td", slot.name),
							m("td", slot.occupant && slot.occupant.id)
						);
					})
			)
		);
	},
};
