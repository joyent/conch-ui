export const mutations = {
    clearActiveDevice(state) {
        state.activeDevice = {};
    },
    clearActiveRoom(state) {
        state.activeRoom = {};
    },
    clearRackLayout(state) {
        state.rackLayout = {};
    },
    clearShowDeviceInRack(state) {
        state.showDeviceInRack = false;
    },
    setActiveDevice(state, activeDevice) {
        state.activeDevice = activeDevice;
    },
    setActiveDeviceDetails(state, activeDeviceDetails) {
        state.activeDeviceDetails = activeDeviceDetails;
    },
    setActiveDeviceSettings(state, activeDeviceSettings) {
        state.activeDeviceSettings = activeDeviceSettings;
    },
    setActiveDeviceValidations(state, activeDeviceValidations) {
        state.activeDeviceValidations = activeDeviceValidations;
    },
    setActiveRoom(state, activeRoom) {
        state.activeRoom = activeRoom;
    },
    setAllRooms(state, allRooms) {
        state.allRooms = allRooms;
    },
    setCurrentWorkspace(state, workspace) {
        state.currentWorkspace = workspace;
    },
    setDevicesByWorkspace(state, devices) {
        state.devicesByWorkspace.push(devices);
    },
    setHardwareProducts(state, hardwareProducts) {
        state.hardwareProducts = hardwareProducts;
    },
    setHighlightDeviceId(state, highlightDeviceId) {
        state.highlightDeviceId = highlightDeviceId;
    },
    setRackLayout(state, rackLayout) {
        state.rackLayout = rackLayout;
    },
    setRackRoomsByWorkspace(state, rackRooms) {
        state.rackRoomsByWorkspace.push(rackRooms);
    },
    setShowDeviceInRack(state, showDeviceInRack) {
        state.showDeviceInRack = showDeviceInRack;
    },
    setWorkspaces(state, workspaces) {
        state.workspaces = workspaces;
    },
    setValidations(state, validations) {
        state.validations = validations;
    },
};

export default {
    mutations,
};
