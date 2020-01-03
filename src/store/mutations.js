export const clearActiveDevice = state => {
    state.activeDevice = {};
};

export const clearActiveRoomName = state => {
    state.activeRoomName = '';
};

export const clearForcePasswordChange = state => {
    state.forcePasswordChange = false;
};

export const clearInvalidCredentials = state => {
    state.invalidCredentials = false;
};

export const clearRackLayout = state => {
    state.rackLayout = {};
};

export const clearShowDeviceInRack = state => {
    state.showDeviceInRack = false;
};

export const clearUserAuthTokens = state => {
    state.userAuthTokens = [];
};

export const setActiveDevice = (state, activeDevice) => {
    state.activeDevice = activeDevice;
};

export const setActiveDeviceDetails = (state, activeDeviceDetails) => {
    state.activeDeviceDetails = activeDeviceDetails;
};

export const setActiveDeviceSettings = (state, activeDeviceSettings) => {
    state.activeDeviceSettings = activeDeviceSettings;
};

export const setActiveDeviceValidations = (state, activeDeviceValidations) => {
    state.activeDeviceValidations = activeDeviceValidations;
};

export const setActiveRoomName = (state, activeRoomName) => {
    state.activeRoomName = activeRoomName;
};

export const setAllRooms = (state, allRooms) => {
    state.allRooms = allRooms;
};

export const setAuthTokens = (state, authTokens) => {
    state.authTokens = authTokens;
};

export const setCurrentUser = (state, currentUser) => {
    state.currentUser = currentUser;
};

export const setCurrentWorkspace = (state, workspace) => {
    state.currentWorkspace = workspace;
};

export const setDevices = (state, devices) => {
    state.devices = devices;
};

export const setDevicesByWorkspace = (state, devices) => {
    state.devicesByWorkspace.push(devices);
};

export const setForcePasswordChange = state => {
    state.forcePasswordChange = true;
};

export const setHardwareProducts = (state, hardwareProducts) => {
    state.hardwareProducts = hardwareProducts;
};

export const setHighlightDeviceId = (state, highlightDeviceId) => {
    state.highlightDeviceId = highlightDeviceId;
};

export const setInvalidCredentials = state => {
    state.invalidCredentials = true;
};

export const setOrganizations = (state, organizations) => {
    state.organizations = organizations;
};

export const setRackLayout = (state, rackLayout) => {
    state.rackLayout = rackLayout;
};

export const setRackRooms = (state, rackRooms) => {
    state.rackRooms = rackRooms;
};

export const setRackRoomsByWorkspace = (state, rackRooms) => {
    state.rackRoomsByWorkspace.push(rackRooms);
};

export const setShowDeviceInRack = (state, showDeviceInRack) => {
    state.showDeviceInRack = showDeviceInRack;
};

export const setUserAuthTokens = (state, userAuthTokens) => {
    state.userAuthTokens = userAuthTokens;
};

export const setUsers = (state, users) => {
    state.users = users;
};

export const setWorkspaces = (state, workspaces) => {
    state.workspaces = workspaces;
};

export const setValidations = (state, validations) => {
    state.validations = validations;
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
    setAllRooms,
    setAuthTokens,
    setCurrentUser,
    setCurrentWorkspace,
    setDevices,
    setDevicesByWorkspace,
    setForcePasswordChange,
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
    setWorkspaces,
    setValidations,
};
