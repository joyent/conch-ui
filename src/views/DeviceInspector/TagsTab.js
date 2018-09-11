import m from "mithril";
import stream from "mithril/stream";
import { Spinner } from "views/component";

import Device from "models/Device";

const AddTagButton = {
	view: ({ attrs: { device } }) => {
		return m(
			"span.icon",
			{
				onclick: () => {
                    console.log('Add!');
					device
						.addTag(["Tag", "Value"]);
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
			const device = new Device(activeDevice().id);
			const headers = [
				m("th", "Name"),
				m("th", "Value"),
				m(
					"th",
					m(AddTagButton, { device }),
					m(SaveTagsButton, { device })
				)
			];
			return device.tags() == null
				? m(Spinner)
				: m(
						"table.table.is-narrow.is-fullwidth",
						m("thead", m("tr", headers)),
						m("tfoot", m("tr", headers)),
						device
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
