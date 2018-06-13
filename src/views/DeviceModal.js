import m from "mithril";

import DeviceInspector from "./DeviceInspector";

export default {
	view: ({ attrs: { activeDeviceId } }) =>
		m(
			".modal.is-active",
			m(".modal-background", {
				onclick() {
					activeDeviceId(null);
				}
			}),
			m(
				".modal-card",
				m(
					"header.modal-card-head",
					m(
						"p.modal-card-title.has-text-left",
						`Device ${activeDeviceId()}`
					),
					m("button.delete[aria-label=close]", {
						onclick() {
							activeDeviceId(null);
						}
					})
				),
				m(
					"section.modal-card-body",
					m(DeviceInspector, { activeDeviceId })
				),
				m("footer.modal-card-foot.is-right")
			)
		)
};
