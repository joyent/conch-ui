import m from "mithril";

const StorageTab = () => {
	const headers = [
		m("th", "Serial Number"),
		m("th", "Enclosure"),
		m("th", "HBA"),
		m("th", "Slot Number"),
		m("th", "Vendor"),
		m("th", "Model"),
		m("th", "Size"),
		m("th", "Drive Type"),
		m("th", "Transport"),
		m("th", "Firmware"),
		m("th", "Health"),
		m("th", "Temperature")
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
								return {
									sortKey:
										100 * (parseInt(disk.hba) || 0) +
										(parseInt(disk.slot) || 0),
									value: [
										id,
										disk.enclosure,
										disk.hba,
										disk.slot,
										disk.vendor,
										disk.model,
										disk.size,
										disk.drive_type,
										disk.transport,
										disk.firmware,
										disk.health,
										disk.temp
									].map(d => m("td", d))
								};
							})
							.sort((a, b) => a.sortKey - b.sortKey)
							.map(a => m("tr", a.value))
				  );
		}
	};
};

export default StorageTab;
