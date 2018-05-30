import m from "mithril";
import stream from "mithril/stream";

import Spinner from "../component/Spinner";

import LayoutTable from "./LayoutTable";

export default () => {
	const deviceFilter = stream("");
	const roomNameFilter = roomName => roomName.indexOf(roomFilterText()) >= 0;
	const rackProgressFilter = stream(() => true);
	let rackRoleFilter = () => true;
	return {
		view: ({ attrs: { activeRack, rackLoading, rackLayout } }) =>
			m(
				"nav.panel",
				m("p.panel-heading", `Rack ${activeRack().name}`),
				m(
					".panel-block",
					m(
						"p.control.has-icons-left",
						m(
							"input.input.is-small[type=text][placeholder=Search Devices]",
							{
								oninput: m.withAttr("value", deviceFilter),
							}
						),
						m("span.icon.is-small.is-left", m("i.fas fa-search"))
					)
				),
				m(
					"p.panel-tabs",
					m("a.is-active", "all"),
					m("a", "validated"),
					m("a", "failing")
				),
				rackLoading() ? m(Spinner) : m(LayoutTable, { rackLayout })
			),
	};
};
