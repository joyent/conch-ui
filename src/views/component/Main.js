import m from "mithril";

import { conchApi } from "config";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default () => {
	let state = {};

	return {
		oninit: () => {
			console.log("foobar");
			return Promise.all([
				m.request({
					method: "GET",
					url: `${conchApi}/workspace`,
					withCredentials: true,
				}),
			]).then(([workspaces]) => {
				state.workspace = workspaces;
			});
		},
		view: ({ children: [contentView] }) => [
			m(Navbar),
			m(
				".container",
				{ style: "margin-top:20px" },
				m(
					".columns",
					m(
						".column.is-2",
						m(Sidebar, {
							isWorkspaceAdmin: true,
							isGlobalAdmin: true,
							workspaces: state.workspaces,
						})
					),
					m(".column.is-10", contentView)
				)
			),
		],
	};
};
