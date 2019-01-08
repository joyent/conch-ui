export const mutations = {
    clearActiveDevice(state) {
        state.activeDevice = '';
    },
    clearActiveRoom(state) {
        state.activeRoom = {};
    },
    clearRackLayout(state) {
        state.rackLayout = {};
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
    setActiveRack(state, activeRack) {
        state.activeRack = activeRack;
    },
    setActiveRoom(state, activeRoom) {
        state.activeRoom = activeRoom;
    },
    setCurrentWorkspace(state, workspace) {
        state.currentWorkspace = workspace;
    },
    setRackLayout(state, rackLayout) {
        state.rackLayout = rackLayout;
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
