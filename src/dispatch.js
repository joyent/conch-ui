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

import Workspaces from "models/Workspace";

/// IIFE to prevent escaping scope
const dispatch = (() => {
	const currentWorkspace = stream();
	const workspaces = stream();
	const user = new User();

	currentWorkspace.map(ws => {
		if (ws) localStorage.setItem("currentWorkspace", ws.id);
	});

	function loadWorkspace(urlWorkspaceId) {
		if (currentWorkspace() && currentWorkspace().id === urlWorkspaceId) {
			return Promise.resolve();
		}

		// check the current list of workspaces for the urlWorkspaceId. If not
		// found, continue and refresh workspaces
		if (workspaces() && urlWorkspaceId) {
			let found = workspaces().find(w => w.id === urlWorkspaceId);
			if (found) {
				currentWorkspace(found);
				return Promise.resolve();
			}
		}
		const workspaceList = new Workspaces('');
		return workspaceList.getAll().then(ws => {
			workspaces(ws);

			// use the workspace ID encoded in the URL if present. Reject and
			// direct to error page if not found
			if (urlWorkspaceId) {
				let found = ws.find(w => w.id === urlWorkspaceId);
				if (!found)
					return Promise.reject(WorkspaceNotFound(urlWorkspaceId));
				currentWorkspace(found);
			} else {
				let current;
				// try to use current workspace in localStorage
				let storedId = localStorage.getItem("currentWorkspace");
				if (storedId) current = ws.find(w => w.id === storedId);

				// if none stored, try to use GLOBAL workspace if available
				if (!current) current = ws.find(w => w.name === "GLOBAL");
				// fallback on first workspace in list
				if (!current) current = ws[0];
				currentWorkspace(current);
			}
		});
	}

	function setupSession(urlWorkspaceId) {
		if (user.loggedIn()) return loadWorkspace(urlWorkspaceId);
		// TODO rewrite this to use model/User
		return user.refreshToken().then(
			() => {
				return loadWorkspace(urlWorkspaceId);
			},
			() => Promise.reject(Login)
		);
	}

	function dispatch(root, routes) {
		let layout;
		let view;
		const table = Object.keys(routes).reduce((accTable, route) => {
			let workspacePrefixedRoute = "/:wid" + route;
			accTable[workspacePrefixedRoute] = {
				onmatch(args, pendingRoute) {
					return setupSession(args.wid).then(
						() => {
							let comp = routes[route];
							layout = comp.layout;
							view = comp.view;
							return {
								view: () =>
									m(comp.view || comp, {
										currentWorkspace,
										workspaces,
										user
									})
							};
						},
						// e may be an error view or an error in the case of bugs
						e => {
							if (e instanceof Error) console.error(e);
							else return e;
						}
					);
				},
				render(vnode) {
					return layout && view
						? m(
								layout,
								{
									currentWorkspace,
									// required to set to false when "logout" link clicked
									user,
									workspaces
								},
								m(view, {
									currentWorkspace,
									workspaces,
									user
								})
						  )
						: vnode;
				}
			};

			return accTable;
		}, {});

		table["/"] = {
			onmatch() {
				return setupSession().then(
					comp => {
						m.route.set(`/${currentWorkspace().id}/status`);
					},
					// e may be an error view or an error in the case of bugs
					e => {
						if (e instanceof Error) console.error(e);
						else return e;
					}
				);
			}
		};

		m.route(root, "/", table);
	}

	return dispatch;
})();

export default dispatch;
