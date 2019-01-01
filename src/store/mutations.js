export const mutations = {
    clearActiveRoom(state) {
        state.activeRoom = {};
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
