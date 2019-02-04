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
    clearShowDeviceInRack({ commit }) {
        commit('clearShowDeviceInRack');
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
    setActiveRoom({ commit }, activeRoom) {
        commit('setActiveRoom', activeRoom);
    },
    setAllRooms({ commit }, allRooms) {
        commit('setAllRooms', allRooms);
    },
    setCurrentWorkspace({ commit }, workspace) {
        commit('setCurrentWorkspace', workspace);
    },
    setDevicesByWorkspace({ commit }, devices) {
        commit('setDevicesByWorkspace', devices);
    },
    setHardwareProducts({ commit }, hardwareProducts) {
        commit('setHardwareProducts', hardwareProducts);
    },
    setHighlightDeviceId({ commit }, highlightDeviceId) {
        commit('setHighlightDeviceId', highlightDeviceId);
    },
    setRackLayout({ commit }, rackLayout) {
        commit('setRackLayout', rackLayout);
    },
    setRackRooms({ commit }, rackRooms) {
        commit('setRackRooms', rackRooms);
    },
    setRackRoomsByWorkspace({ commit }, rackRooms) {
        commit('setRackRoomsByWorkspace', rackRooms);
    },
    setShowDeviceInRack({ commit }, showDeviceInRack) {
        commit('setShowDeviceInRack', showDeviceInRack);
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
