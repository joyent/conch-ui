export const actions = {
    clearActiveDevice({ commit }) {
        commit('clearActiveDevice');
    },
    clearActiveRoom({ commit }) {
        commit('clearActiveRoom');
    },
    clearRackLayout({ commit }) {
        commit('clearRackLayout');
    },
    setActiveDevice({ commit }, activeDevice) {
        commit('setActiveDevice', activeDevice);
    },
    setActiveDeviceDetails({ commit }, activeDeviceDetails) {
        commit('setActiveDeviceDetails', activeDeviceDetails);
    },
    setActiveDeviceSettings({ commit }, activeDeviceSettings) {
        commit('setActiveDeviceSettings', activeDeviceSettings);
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
    },
};

export default {
    actions,
};
