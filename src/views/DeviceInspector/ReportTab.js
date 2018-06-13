import m from "mithril";

const ReportTab = {
	view: ({ attrs: { activeDevice } }) =>
		m(
			".content.has-text-left",
			m(
				"pre",
				JSON.stringify(activeDevice().latest_report || {}, null, "  ")
			)
		)
};

export default ReportTab;
