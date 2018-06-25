import m from "mithril";

import DeviceInspector from "./DeviceInspector";

export default () => {
	return {
		oninit: ({ attrs: { activeDeviceId } }) => {
			// close the modal when Esc is pressed. Only fire once
			document.addEventListener(
				"keydown",
				function(evt) {
					if (evt.keyCode == 27) {
						activeDeviceId(null);
					}
				},
				{ once: true }
			);
		},
		view: ({ attrs: { activeDeviceId } }) =>
			m(
				".modal.is-active",
				// override. keep the modal at the top, not center
				{ style: "align-items: start" },
				m(".modal-background", {
					onclick() {
						activeDeviceId(null);
					}
				}),
				m(
					".modal-card",
					// give a bit of space
					{ style: "margin-top: 5vh" },
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
};
