export const clearActiveDevice = ({ commit }) => {
    commit('clearActiveDevice');
};

export const clearActiveRoom = ({ commit }) => {
    commit('clearActiveRoom');
};

export const clearForcePasswordChange = ({ commit }) => {
    commit('clearForcePasswordChange');
};

export const clearRackLayout = ({ commit }) => {
    commit('clearRackLayout');
};

export const clearShowDeviceInRack = ({ commit }) => {
    commit('clearShowDeviceInRack');
};

export const setActiveDevice = ({ commit }, activeDevice) => {
    commit('setActiveDevice', activeDevice);
};

export const setActiveDeviceDetails = ({ commit }, activeDeviceDetails) => {
    commit('setActiveDeviceDetails', activeDeviceDetails);
};

export const setActiveDeviceSettings = ({ commit }, activeDeviceSettings) => {
    commit('setActiveDeviceSettings', activeDeviceSettings);
};

export const setActiveDeviceValidations = ({ commit }, activeDeviceValidations) => {
    commit('setActiveDeviceValidations', activeDeviceValidations);
};

export const setActiveRoom = ({ commit }, activeRoom) => {
    commit('setActiveRoom', activeRoom);
};

export const setAllRooms = ({ commit }, allRooms) => {
    commit('setAllRooms', allRooms);
};

export const setAuthTokens = ({ commit }, authTokens) => {
    commit('setAuthTokens', authTokens);
};

export const setCurrentWorkspace = ({ commit }, workspace) => {
    commit('setCurrentWorkspace', workspace);
};

export const setDevicesByWorkspace = ({ commit }, devices) => {
    commit('setDevicesByWorkspace', devices);
};

export const setForcePasswordChange = ({ commit }) => {
    commit('setForcePasswordChange');
};

export const setHardwareProducts = ({ commit }, hardwareProducts) => {
    commit('setHardwareProducts', hardwareProducts);
};

export const setHighlightDeviceId = ({ commit }, highlightDeviceId) => {
    commit('setHighlightDeviceId', highlightDeviceId);
};

export const setRackLayout = ({ commit }, rackLayout) => {
    commit('setRackLayout', rackLayout);
};

export const setRackRooms = ({ commit }, rackRooms) => {
    commit('setRackRooms', rackRooms);
};

export const setRackRoomsByWorkspace = ({ commit }, rackRooms) => {
    commit('setRackRoomsByWorkspace', rackRooms);
};

export const setShowDeviceInRack = ({ commit }, showDeviceInRack) => {
    commit('setShowDeviceInRack', showDeviceInRack);
};

export const setWorkspaces = ({ commit }, workspaces) => {
    commit('setWorkspaces', workspaces);
};

export const setValidations = ({ commit }, validations) => {
    commit('setValidations', validations);
};

export default {
    clearActiveDevice,
    clearActiveRoom,
    clearForcePasswordChange,
    clearRackLayout,
    clearShowDeviceInRack,
    setActiveDevice,
    setActiveDeviceDetails,
    setActiveDeviceSettings,
    setActiveDeviceValidations,
    setActiveRoom,
    setAllRooms,
    setAuthTokens,
    setCurrentWorkspace,
    setDevicesByWorkspace,
    setForcePasswordChange,
    setHardwareProducts,
    setHighlightDeviceId,
    setRackLayout,
    setRackRooms,
    setRackRoomsByWorkspace,
    setShowDeviceInRack,
    setWorkspaces,
    setValidations,
};
