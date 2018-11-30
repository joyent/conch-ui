/* Exports a dispatch function to handle workspace-specific routing and authorization.
 *
 * To use, invoke `dispatch` with an object with string routes as keys and
 * "view" objects as values. Workspace IDs will be automatically prefixed to
 * the beginning of routes. Use Mithril routing syntax
 * (https://mithril.js.org/route.html#routing-parameters) in routes to specify
 * parameters.
 *
 * "view" objects are objects that specify a "layout" (Mithril Vnode that
 * doesn't doesn't change during page navigation) and a "view" (Mithril Vnode
 * showing the route-specific content).
 *
 * This technique was inspired by http://sagegerard.com/mithril-router-cleanup/.
 *
 * Example:
 *
 * dispatch( document.body, {
 *     {
 *         // route will be constructed as /:workspaceId/foobar/:bax
 *         "/foobar/:baz": { layout: Main, view: Foobar }
 *     }
 * });
 *
 *
 * Redirects to the Login view if user is unauthorized. Shows authorized users
 * the WorkspaceNotFound view if the user doesn't have access to the specified
 * workspace or if it doesn't exist. Passes the streams `currentWorkspace` and
 * `workspaces` to "view" Vnodes when authenticated.
*/

import m from "mithril";
import stream from "mithril/stream";

import WorkspaceNotFound from "views/WorkspaceNotFound";
import Login from "views/Login";
import Request from "util/Request";
import User from "models/User";

import Workspace from "models/Workspace";

/// IIFE to prevent escaping scope
const dispatch = (() => {
	const user = new User();

	function dispatch(root, routes) {
		let layout;
		let view;
		const table = Object.keys(routes).reduce((accTable, route) => {
			let workspacePrefixedRoute = "/:wid" + route;
			let ws;
			accTable[workspacePrefixedRoute] = {
				onmatch(args, pendingRoute) {
					ws = new Workspace(args.wid);
					const matcher = () => {
						let comp = routes[route];
						layout = comp.layout;
						view = comp.view;
						return {
							view: () =>
								m(comp.view || comp, {
									currentWorkspace: ws.currentWorkspace,
									workspaces: ws.workspaces,
									user
								})
						};
					};

					if (!user.loggedIn()) return m.route.set("/");
					return ws
						.loadCurrentWorkspace()
						.catch(WorkspaceNotFound(args.wid))
						.then(matcher);
				},
				render(vnode) {
					return layout && view
						? m(
								layout,
								{
									currentWorkspace: ws.currentWorkspace,
									workspaces: ws.workspaces,
									user
								},
								m(view, {
									currentWorkspace: ws.currentWorkspace,
									workspaces: ws.workspaces,
									user
								})
						  )
						: vnode;
				}
			};

			return accTable;
		}, {});

		table["/login"] = Login;
		table["/"] = {
			onmatch() {
				if (!user.loggedIn()) return m.route.set("/login");

				const ws = new Workspace();
				return ws
					.loadCurrentWorkspace()
					.then(w => m.route.set(`/${w.id}/status`));
			}
		};

		m.route(root, "/", table);
	}

	return dispatch;
})();

export default dispatch;
