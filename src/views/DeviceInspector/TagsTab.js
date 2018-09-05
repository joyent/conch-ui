import m from "mithril";
import { Spinner } from "views/component";

const SettingsTab = () => {
	const headers = [m("th", "Name"), m("th", "Value")];
	return {
		view: ({ attrs: { activeDevice } }) => {
			return activeDevice().tags() == null
				? m(Spinner)
				: m(
						"table.table.is-narrow.is-fullwidth",
						m("thead", m("tr", headers)),
						m("tfoot", m("tr", headers)),
						Object.entries(activeDevice().tags())
							.sort()
							.map(([name, value]) =>
								m(
									"tr",
									m("td.has-text-weight-semibold", name),
									m("td", value)
								)
							)
				  );
		}
	};
};

export default SettingsTab;
