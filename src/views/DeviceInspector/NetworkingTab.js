import m from "mithril";

const NetworkingRow = () => {
	let revealDetails = false;
	return {
		view: ({ attrs: { iface } }) => [
			m(
				"tr",
				{
					onclick() {
						revealDetails = !revealDetails;
					},
					class: revealDetails && "is-selected",
					style: "cursor: pointer"
				},
				m(
					"td",
					m(
						".icon",
						revealDetails
							? m("i.fas.fa-caret-down")
							: m("i.fas.fa-caret-right")
					)
				),
				m("td", iface.state),
				m("td", iface.id),
				m("td", iface.ipaddr),
				m("td", iface.mac)
			),
			revealDetails &&
				m(
					"tr",
					m("td"),
					m(
						"td[colspan=4]",
						m(
							".content",
							m(
								"table.table.is-narrow.is-marginless",
								m(
									"tbody",
									[
										["Product", iface.product],
										["Peer Switch", iface.peer_switch],
										["Peer Port", iface.peer_port],
										["Peer Mac", iface.peer_mac]
									].map(([k, v]) =>
										m(
											"tr",
											m("td.has-text-weight-semibold", k),
											m("td", v)
										)
									)
								)
							)
						)
					)
				)
		]
	};
};

const NetworkingTab = () => {
	const headers = [
		m("th", ""),
		m("th", "State"),
		m("th", "Interface"),
		m("th", "IP Address"),
		m("th", "MAC")
	];
	let nics;

	return {
		oninit: ({ attrs: { activeDevice } }) => {
			nics = activeDevice.map(device => device.interfaces());
		},
		view: () => {
			return nics == null
				? m(Spinner)
				: m(
						"table.table.is-narrow.is-fullwidth",
						m("thead", m("tr", headers)),
						m("tfoot", m("tr", headers)),
						Object.entries(nics())
							.sort()
							.map(([id, iface]) => {
								iface.id = id;
								return m(NetworkingRow, { iface });
							})
				  );
		}
	};
};

export default NetworkingTab;
