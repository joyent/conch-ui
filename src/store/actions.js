export const clearActiveDevice = ({ commit }) => {
    commit('clearActiveDevice');
};

export const clearActiveRoomName = ({ commit }) => {
    commit('clearActiveRoomName');
};

export const clearForcePasswordChange = ({ commit }) => {
    commit('clearForcePasswordChange');
};

export const clearInvalidCredentials = ({ commit }) => {
    commit('clearInvalidCredentials');
};

export const clearRackLayout = ({ commit }) => {
    commit('clearRackLayout');
};

export const clearShowDeviceInRack = ({ commit }) => {
    commit('clearShowDeviceInRack');
};

export const clearUserAuthTokens = ({ commit }) => {
    commit('clearUserAuthTokens');
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

export const setActiveDeviceValidations = (
    { commit },
    activeDeviceValidations
) => {
    commit('setActiveDeviceValidations', activeDeviceValidations);
};

export const setActiveRoomName = ({ commit }, activeRoomName) => {
    commit('setActiveRoomName', activeRoomName);
};

export const setAuthTokens = ({ commit }, authTokens) => {
    commit('setAuthTokens', authTokens);
};

export const setBuilds = ({ commit }, builds) => {
    commit('setBuilds', builds);
};

export const setCurrentBuild = ({ commit }, currentBuild) => {
    commit('setCurrentBuild', currentBuild);
};

export const setCurrentBuildDevices = ({ commit }, devices) => {
    commit('setCurrentBuildDevices', devices);
};

export const setCurrentBuildOrganizations = ({ commit }, organizations) => {
    commit('setCurrentBuildOrganizations', organizations);
};

export const setCurrentBuildRacks = ({ commit }, racks) => {
    commit('setCurrentBuildRacks', racks);
};

export const setCurrentBuildUsers = ({ commit }, users) => {
    commit('setCurrentBuildUsers', users);
};

export const setCurrentUser = ({ commit }, currentUser) => {
    commit('setCurrentUser', currentUser);
};

export const setCurrentWorkspace = ({ commit }, workspace) => {
    commit('setCurrentWorkspace', workspace);
};

export const setDatacenterRooms = ({ commit }, datacenterRooms) => {
    commit('setDatacenterRooms', datacenterRooms);
};

export const setDevices = ({ commit }, devices) => {
    commit('setDevices', devices);
};

export const setDevicesByWorkspace = ({ commit }, devices) => {
    commit('setDevicesByWorkspace', devices);
};

export const setForcePasswordChange = ({ commit }) => {
    commit('setForcePasswordChange');
};

export const setGlobalWorkspaceId = ({ commit }, globalWorkspaceId) => {
    commit('setGlobalWorkspaceId', globalWorkspaceId);
};

export const setHardwareProducts = ({ commit }, hardwareProducts) => {
    commit('setHardwareProducts', hardwareProducts);
};

export const setHighlightDeviceId = ({ commit }, highlightDeviceId) => {
    commit('setHighlightDeviceId', highlightDeviceId);
};

export const setInvalidCredentials = ({ commit }) => {
    commit('setInvalidCredentials');
};

export const setOrganizations = ({ commit }, organizations) => {
    commit('setOrganizations', organizations);
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

export const setUserAuthTokens = ({ commit }, userAuthTokens) => {
    commit('setUserAuthTokens', userAuthTokens);
};

export const setUsers = ({ commit }, users) => {
    commit('setUsers', users);
};

export const setValidations = ({ commit }, validations) => {
    commit('setValidations', validations);
};

export default {
    clearActiveDevice,
    clearActiveRoomName,
    clearForcePasswordChange,
    clearInvalidCredentials,
    clearRackLayout,
    clearShowDeviceInRack,
    clearUserAuthTokens,
    setActiveDevice,
    setActiveDeviceDetails,
    setActiveDeviceSettings,
    setActiveDeviceValidations,
    setActiveRoomName,
    setAuthTokens,
    setBuilds,
    setCurrentBuild,
    setCurrentBuildDevices,
    setCurrentBuildOrganizations,
    setCurrentBuildRacks,
    setCurrentBuildUsers,
    setCurrentUser,
    setCurrentWorkspace,
    setDatacenterRooms,
    setDevices,
    setDevicesByWorkspace,
    setForcePasswordChange,
    setGlobalWorkspaceId,
    setHardwareProducts,
    setHighlightDeviceId,
    setInvalidCredentials,
    setOrganizations,
    setRackLayout,
    setRackRooms,
    setRackRoomsByWorkspace,
    setShowDeviceInRack,
    setUserAuthTokens,
    setUsers,
    setValidations,
};
