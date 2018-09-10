import m from "mithril";
import stream from "mithril/stream";
import { Spinner } from "views/component";

const AddTagButton = {
	view: ({ attrs: { activeDevice } }) => {
		return m(
			"span.icon",
			{
				onclick: () => {
					activeDevice()
						.tags()
						.push(["Tag", "Value"]);
					m.redraw();
				}
			},
			m("i.fas.fa-plus")
		);
	}
};

const SaveTagsButton = {
	view: () => {
		return m(
			"span.icon",
			{
				onclick: () => {
					console.log("Save!");
				}
			},
			m("i.fas.fa-save")
		);
	}
};

const SettingsTab = () => {
	return {
		view: ({ attrs: { activeDevice } }) => {
			const headers = [
				m("th", "Name"),
				m("th", "Value"),
				m(
					"th",
					m(AddTagButton, { activeDevice }),
					m(SaveTagsButton, { activeDevice })
				)
			];
			return activeDevice().tags() == null
				? m(Spinner)
				: m(
						"table.table.is-narrow.is-fullwidth",
						m("thead", m("tr", headers)),
						m("tfoot", m("tr", headers)),
						activeDevice()
							.tags()
							.sort()
							.map(([name, value]) =>
								m(
									"tr",
									m(
										"td",
										m("input[type=text]", {
											placeholder: name
										})
									),
									m(
										"td",
										m("input[type=text]", {
											placeholder: value
										})
									),
									m(
										"td",
										m(
											"span.icon",
											{
												onclick: () => {
													console.log("delete");
												}
											},
											m("i.fas.fa-minus-square")
										)
									)
								)
							)
				  );
		}
	};
};

export default SettingsTab;
