export const activeDeviceId = state => state.activeDevice.id;
export const currentWorkspaceId = state => state.currentWorkspace.id;
export const currentWorkspaceName = state => state.currentWorkspace.name;
export const findWorkspaceById = state => id =>
    state.workspaces.find(w => w.id === id);
export const findWorkspaceByName = state => name =>
    state.workspaces.find(w => w.name === name);
export const getDevicesByWorkspace = state => workspaceId => {
    const workspaceDevices = state.devicesByWorkspace.find(workspace => {
        return Object.keys(workspace)[0] === workspaceId;
    });

    return workspaceDevices ? workspaceDevices : null;
};

export const getRackRoomsByWorkspace = state => workspaceId => {
    const workspaceRackRooms = state.rackRoomsByWorkspace.find(workspace => {
        return Object.keys(workspace)[0] === workspaceId;
    });

    return workspaceRackRooms ? workspaceRackRooms : null;
};

export const getRoomByName = state => name =>
    state.allRooms.find(room => room.name === name);

export const loadCurrentWorkspace = state => id => {
    let currentWorkspace = null;

    if (id) {
        currentWorkspace = findWorkspaceById(state)(id);
    }

    if (!currentWorkspace) {
        currentWorkspace = findWorkspaceById(state)(
            sessionStorage.getItem('currentWorkspace')
        );
    }

    if (!currentWorkspace) {
        currentWorkspace = findWorkspaceByName(state)('GLOBAL');
    }

    if (!currentWorkspace) {
        currentWorkspace = state.workspaces[0];
    }

    return currentWorkspace;
};

export default {
    activeDeviceId,
    currentWorkspaceId,
    currentWorkspaceName,
    findWorkspaceById,
    findWorkspaceByName,
    getDevicesByWorkspace,
    getRackRoomsByWorkspace,
    getRoomByName,
    loadCurrentWorkspace,
};
