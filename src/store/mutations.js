export const mutations = {
    setCurrentWorkspace(state, workspace) {
        state.currentWorkspace = workspace;
    },
    setWorkspaces(state, workspaces) {
        state.workspaces = workspaces;
    },
};

export default {
    mutations,
};
