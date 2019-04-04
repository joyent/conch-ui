export const clearActiveDevice = (state) => {
    state.activeDevice = {};
};

export const clearActiveRoom = (state) => {
    state.activeRoom = {};
};

export const clearForcePasswordChange = (state) => {
    state.forcePasswordChange = false;
};

export const clearRackLayout = (state) => {
    state.rackLayout = {};
};

export const clearShowDeviceInRack = (state) => {
    state.showDeviceInRack = false;
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

export const setActiveRoom = (state, activeRoom) => {
    state.activeRoom = activeRoom;
};

export const setAllRooms = (state, allRooms) => {
    state.allRooms = allRooms;
};

export const setCurrentWorkspace = (state, workspace) => {
    state.currentWorkspace = workspace;
};

export const setDevicesByWorkspace = (state, devices) => {
    state.devicesByWorkspace.push(devices);
};

export const setForcePasswordChange = (state) => {
    state.forcePasswordChange = true;
};

export const setHardwareProducts = (state, hardwareProducts) => {
    state.hardwareProducts = hardwareProducts;
};

export const setHighlightDeviceId = (state, highlightDeviceId) => {
    state.highlightDeviceId = highlightDeviceId;
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

export const setWorkspaces = (state, workspaces) => {
    state.workspaces = workspaces;
};

export const setValidations = (state, validations) => {
    state.validations = validations;
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
