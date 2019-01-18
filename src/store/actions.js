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
    setActiveDeviceValidations({ commit }, activeDeviceValidations) {
        commit('setActiveDeviceValidations', activeDeviceValidations);
    },
    setActiveRack({ commit }, activeRack) {
        commit('setActiveRack', activeRack);
    },
    setActiveRoom({ commit }, activeRoom) {
        commit('setActiveRoom', activeRoom);
    },
    setAllRooms({ commit }, allRooms) {
        commit('setAllRooms', allRooms);
    },
    setCurrentWorkspace({ commit }, workspace) {
        commit('setCurrentWorkspace', workspace);
    },
    setHighlightDeviceId({ commit }, highlightDeviceId) {
        commit('setHighlightDeviceId', highlightDeviceId);
    },
    setRackLayout({ commit }, rackLayout) {
        commit('setRackLayout', rackLayout);
    },
    setWorkspaces({ commit }, workspaces) {
        commit('setWorkspaces', workspaces);
    },
    setValidations({ commit }, validations) {
        commit('setValidations', validations);
    },
};

export default {
    actions,
};
