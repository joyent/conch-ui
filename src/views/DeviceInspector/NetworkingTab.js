import m from "mithril";

const NetworkingTab = () => {
	const headers = [
		m("th", "Name"),
		m("th", "MAC"),
		m("th", "IP Address"),
		m("th", "State"),
		m("th", "Product"),
		m("th", "Peer Switch"),
		m("th", "Peer Port"),
		m("th", "Peer MAC")
	];
	let nics;

	return {
		oninit: ({ attrs: { activeDevice } }) => {
			nics = activeDevice.map(
				device =>
					(device.latest_report && device.latest_report.interfaces) ||
					{}
			);
		},
		view: () => {
			return nics() == null
				? m(Spinner)
				: m(
						"table.table.is-narrow.is-fullwidth",
						m("thead", m("tr", headers)),
						m("tfoot", m("tr", headers)),
						Object.entries(nics())
							.sort()
							.map(([id, iface]) =>
								m(
									"tr",
									[
										id,
										iface.mac,
										iface.ipaddr,
										iface.state,
										iface.product,
										iface.peer_switch,
										iface.peer_port,
										iface.peer_mac
									].map(a => m("td", a))
								)
							)
				  );
		}
	};
};

export default NetworkingTab;
