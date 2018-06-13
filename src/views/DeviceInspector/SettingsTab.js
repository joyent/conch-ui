import m from "mithril";
import { Spinner } from "../component";

const SettingsTab = () => {
	const headers = [m("th", "Name"), m("th", "Value")];
	return {
		view: ({ attrs: { deviceSettings } }) => {
			return deviceSettings() == null
				? m(Spinner)
				: m(
						"table.table.is-narrow.is-fullwidth",
						m("thead", m("tr", headers)),
						m("tfoot", m("tr", headers)),
						Object.entries(deviceSettings())
							.sort()
							.map(([name, value]) =>
								m("tr", m("td", name), m("td", value))
							)
				  );
		}
	};
};

export default SettingsTab;
