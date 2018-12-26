export const actions = {
    setCurrentWorkspace({ commit }, workspace) {
        commit('setCurrentWorkspace', workspace);
    },
    setWorkspaces({ commit }, workspaces) {
        commit('setWorkspaces', workspaces);
    }
};

export default {
    actions,
};
