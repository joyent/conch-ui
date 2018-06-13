import m from "mithril";

const DiskRow = () => {
	let revealDetails = false;
	return {
		view: ({ attrs: { disk } }) => [
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
				m("td", disk.health),
				m("td", disk.id),
				m("td", disk.enclosure),
				m("td", disk.hba),
				m("td", disk.slot)
			),
			revealDetails &&
				m(
					"tr",
					m("td"),
					m(
						"td[colspan=5]",
						m(
							".content",
							m(
								"table.table.is-narrow.is-marginless",
								m(
									"tbody",
									[
										["Vendor", disk.vendor],
										["Model", disk.model],
										["Size", disk.size],
										["Drive Type", disk.drive_type],
										["Transport", disk.transport],
										["Firmware", disk.firmware],
										["Temperature", disk.temperature]
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

const StorageTab = () => {
	const headers = [
		m("th", ""),
		m("th", "Health"),
		m("th", "Serial Number"),
		m("th", "Enclosure"),
		m("th", "HBA"),
		m("th", "Slot Number")
	];
	let disks;

	return {
		oninit: ({ attrs: { activeDevice } }) => {
			disks = activeDevice.map(
				device =>
					(device.latest_report && device.latest_report.disks) || {}
			);
		},
		view: () => {
			return disks() == null
				? m(Spinner)
				: m(
						"table.table.is-narrow.is-fullwidth",
						m("thead", m("tr", headers)),
						m("tfoot", m("tr", headers)),

						Object.entries(disks())
							.map(([id, disk]) => {
								disk.id = id;
								return {
									sortKey:
										100 * (parseInt(disk.hba) || 0) +
										(parseInt(disk.slot) || 0),
									disk
								};
							})
							.sort((a, b) => a.sortKey - b.sortKey)
							.map(({ disk }) => m(DiskRow, { disk }))
				  );
		}
	};
};

export default StorageTab;
