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
	const currentWorkspace = stream();

	function dispatch(root, routes) {
		const table = Object.keys(routes).reduce((accTable, route) => {
			const workspacePrefixedRoute = "/:wid" + route;
			const comp = routes[route];
			const layout = comp.layout;
			const view = comp.view;

			accTable[workspacePrefixedRoute] = {
				onmatch(args, pendingRoute) {
					if (!user.loggedIn()) return m.route.set("/login");
					return Workspace.loadAllWorkspaces()
						.then(() => new Workspace(args.wid))
						.then(currentWorkspace)
						.then(() =>
							m(view, {
								currentWorkspace,
								workspaces: Workspace.workspaces,
								user
							})
						)
						.catch(WorkspaceNotFound(args.wid));
				},
				render() {
					return m(
						layout,
						{
							currentWorkspace,
							workspaces: Workspace.workspaces,
							user
						},
						m(view, {
							currentWorkspace,
							workspaces: Workspace.workspaces,
							user
						})
					);
				}
			};

			return accTable;
		}, {});

		table["/login"] = Login;
		table["/"] = {
			onmatch() {
				if (!user.loggedIn()) return m.route.set("/login");

				return Workspace.loadAllWorkspaces()
					.then(Workspace.findBestWorkspace)
					.then(w => m.route.set(`/${w.id}/status`))
					.catch(m.route.set("/login"));
			}
		};

		m.route(root, "/", table);
	}

	return dispatch;
})();

export default dispatch;
