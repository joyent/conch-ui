import m from "mithril";

import { conchApi } from "config";
import t from "i18n4v";

// Not a normal closure component. Creates a closure with urlWorkspaceId
export default (urlWorkspaceId) => {
	return {
	view: () =>
		m(
			".modal.is-active",
			{
				onclick: (e) => { m.route.set("/"); }
			},
			m(".modal-background"),
			m(
				".modal-content.content",
				m(".box",
					m(".subtitle.has-text-centered", "Cannot load workspace"),
					m("p", "You do not have access to Workspace ID ",
						m("span.has-text-weight-bold", urlWorkspaceId),
						` as specified in the URL. Click anywhere to load a
						different workspace you may access.`),
					m("p", `The URL may be incorrect or you may not have
						access.  Ask a workspace adminstrator if you require
						access to this workspace.`
					)
				)
			),
			m("button.modal-close.is-large")
		)
	};
};
