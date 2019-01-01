export const actions = {
    clearActiveRoom({ commit }) {
        commit('clearActiveRoom');
    },
    setActiveRack({ commit }, activeRack) {
        commit('setActiveRack', activeRack);
    },
    setActiveRoom({ commit }, activeRoom) {
        commit('setActiveRoom', activeRoom);
    },
    setCurrentWorkspace({ commit }, workspace) {
        commit('setCurrentWorkspace', workspace);
    },
    setRackLayout({ commit }, rackLayout) {
        commit('setRackLayout', rackLayout);
    },
    setWorkspaces({ commit }, workspaces) {
        commit('setWorkspaces', workspaces);
    }
};

export default {
    actions,
};
