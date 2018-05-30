import m from "mithril";

function progressIcon(progress) {
	switch (progress) {
		case "failing":
			return m("span.has-text-danger", m("i.fas fa-exclamation"));
		case "in progress":
			return m("span.has-text-info", m("i.fas fa-spinner"));
		case "validated":
			return m("span", m("i.fas fa-check-circle"));
		default:
			return m("span", m("i.fas fa-ellipsis-h"));
	}
}

export default {
	view: ({ attrs: { progress } }) => progressIcon(progress),
};
