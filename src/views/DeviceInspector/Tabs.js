import m from "mithril";
import stream from "mithril/stream";

export default () => {
	const activeTab = stream();
	return {
		oninit: ({ attrs: { tabs } }) => {
			let activeTabTitle = m.route.param("activeDeviceTab");
			let showTab = tabs[0];
			if (activeTabTitle)
				showTab =
					tabs.find(tab => tab.title === activeTabTitle) || showTab;

			activeTab(showTab);

			activeTab.map(tab => {
				let route = m.route.get();
				let [mainRoute, queryS] = route.split("?");
				let queryParams;
				if (queryS) queryParams = m.parseQueryString(queryS);
				else queryParams = {};
				queryParams.activeDeviceTab = tab.title;
				let newQueryS = m.buildQueryString(queryParams);
				m.route.set(`${mainRoute}?${newQueryS}`);
			});
		},
		view: ({ attrs: { tabs, activeDevice, deviceSettings } }) => {
			return [
				m(
					".tabs.is-centered.is-boxed.is-small",
					m(
						"ul",
						tabs.map(tab =>
							m(
								"li",
								{
									class:
										activeTab().title === tab.title &&
										"is-active",
									onclick() {
										activeTab(tab);
									}
								},
								m("a", tab.title)
							)
						)
					)
				),
				activeTab().component &&
					m(activeTab().component, { activeDevice, deviceSettings })
			];
		}
	};
};
