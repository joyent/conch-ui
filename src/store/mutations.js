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
};

export default {
    mutations,
};
