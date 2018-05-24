import m from "mithril";
import stream from "mithril/stream";

import Spinner from "../component/Spinner";

import LayoutTable from "./LayoutTable";

export default () => {
	const rackFilterText = stream("");
	const roomNameFilter = roomName => roomName.indexOf(roomFilterText()) >= 0;
	const rackProgressFilter = stream(() => true);
	let rackRoleFilter = () => true;
	return {
		view: ({ attrs: { activeRack, rackLoading, rackLayout } }) =>
			m(
				"nav.panel",
				m("p.panel-heading", `${activeRack().name}`),
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
