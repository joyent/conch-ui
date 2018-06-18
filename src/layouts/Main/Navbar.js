import m from "mithril";
import keyBy from "lodash/keyBy";
import sortBy from "lodash/sortBy";

export default () => {
	let menuActive = false;

	const WorkspaceLink = {
		view: ({ attrs: { workspace }, children }) =>
			m(
				"li",
				m(
					"a.navbar-item",
					{
						onclick() {
							menuActive = false;
							const route = m.route.get();
							const nonWorkspaceRoute = route.substring(
								route.indexOf("/", 1)
							);
							m.route.set(`/${workspace.id}${nonWorkspaceRoute}`);
						}
					},
					workspace.name
				),
				children
			)
	};

	const workspaceGraphLinks = workspaceGraph => {
		const asLink = workspace => {
			return m(
				WorkspaceLink,
				{ workspace },
				workspaceGraph.graph[workspace.id] &&
					m(
						"ul",
						sortBy(workspaceGraph.graph[workspace.id], [
							"name"
						]).map(asLink)
					)
			);
		};
		return sortBy(workspaceGraph.roots, ["name"]).map(root =>
			m("ul", asLink(root))
		);
	};

	return {
		view: ({ attrs: { currentWorkspace, workspaces } }) => {
			const workspaceIdToWorkspace = keyBy(workspaces(), "id");

			const workspaceGraph = workspaces().reduce(
				(acc, workspace) => {
					// global workspace
					if (!workspace.parent_id) {
						acc.roots.push(workspace);
						return acc;
					}

					if (acc.graph[workspace.parent_id])
						acc.graph[workspace.parent_id].push(workspace);
					else acc.graph[workspace.parent_id] = [workspace];

					// if the parent isn't present, then the workspace is a root
					if (!workspaceIdToWorkspace[workspace.parent_id])
						acc.roots.push(workspace);
					return acc;
				},
				{ roots: [], graph: {} }
			);

			return m(
				".navbar[role=navigation]",
				m(
					".navbar-brand",
					m(".navbar-item", m("a.title", "Conch")),
					m(
						".navbar-burger",
						{
							onclick() {
								menuActive = !menuActive;
							},
							class: menuActive && "is-active"
						},
						m("span"),
						m("span"),
						m("span")
					)
				),
				m(
					".navbar-menu",
					{ class: menuActive && "is-active" },
					m(
						".navbar-end",
						m(
							".navbar-item.has-dropdown.is-hoverable",
							m("a.navbar-link", currentWorkspace().name),
							m(
								".navbar-dropdown.is-right",
								workspaceGraphLinks(workspaceGraph)
							)
						)
					)
				)
			);
		}
	};
};
