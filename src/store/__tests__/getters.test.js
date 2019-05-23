import getters from '../getters.js';

// Fixtures
import activeDevice from '@src/__fixtures__/activeDevice.js'
import activeRoom from '@src/__fixtures__/activeRoom.js';
import allRooms from '@src/__fixtures__/allRooms.js';
import devicesByWorkspaceId from '@src/__fixtures__/devicesByWorkspace.js';
import rackLayout from '@src/__fixtures__/rackLayout.js';
import rackRoomsByWorkspaceId from '@src/__fixtures__/rackRoomsByWorkspace.js';
import workspaces from '@src/__fixtures__/workspaces.js';

describe('getters', () => {
    let state;

    beforeEach(() => {
        state = {};
    });

    describe('activeDeviceId', () => {
        test('it returns the id of the active device', () => {
            state = { activeDevice };
            const activeDeviceId = getters.activeDeviceId(state);

            expect(activeDeviceId).toEqual(activeDevice.id);
        });
    });

    describe('currentWorkspaceId', () => {
        test('it returns the id of the current workspace', () => {
            state = { currentWorkspace: workspaces[0] };
            const currentWorkspaceId = getters.currentWorkspaceId(state);

            expect(currentWorkspaceId).toEqual(state.currentWorkspace.id);
        });
    });

    describe('currentWorkspaceName', () => {
        test('it returns the name of the current workspace', () => {
            state = { currentWorkspace: workspaces[0] };
            const currentWorkspaceName = getters.currentWorkspaceName(state);

            expect(currentWorkspaceName).toEqual(state.currentWorkspace.name);
        });
    });

    describe('findWorkspaceById', () => {
        test('it returns the workspace matching the id', () => {
            const workspaceId = workspaces[0].id;
            state = { workspaces };
            const workspace = getters.findWorkspaceById(state)(workspaceId);

            expect(workspace).toMatchObject(workspaces[0]);
        });
    });

    describe('findWorkspaceByName', () => {
        test('it returns the workspace matching the name', () => {
            const workspaceName = workspaces[0].name;
            state = { workspaces };
            const workspace = getters.findWorkspaceByName(state)(workspaceName);

            expect(workspace).toMatchObject(workspaces[0]);
        });
    });

    describe('getDevicesByWorkspace', () => {
        test('it returns the devices from the workspace', () => {
            const workspaceId = workspaces[3].id;

            state = { devicesByWorkspace: devicesByWorkspaceId };
            const devices = getters.getDevicesByWorkspace(state)(workspaceId);

            expect(devices).toMatchObject(devicesByWorkspaceId[0]);
        });
    });

    describe('getRackRoomsByWorkspace', () => {
        test('it returns the rack rooms from the workspace', () => {
            const workspaceId = workspaces[3].id;
            state = { rackRoomsByWorkspace: rackRoomsByWorkspaceId };
            const rackRooms = getters.getRackRoomsByWorkspace(state)(workspaceId);

            expect(rackRooms).toMatchObject(rackRoomsByWorkspaceId[0]);
        });
    });

    describe('getRoomByName', () => {
        test('it returns the room matching the name', () => {
            const name = allRooms[0].name;
            state = { allRooms };
            const rackRoom = getters.getRoomByName(state)(name);

            expect(rackRoom).toMatchObject(allRooms[0]);
        });
    });

    describe('loadCurrentWorkspace', () => {
        beforeEach(() => {
            state = { workspaces };
        });

        test('it returns the workspace matching the workspaceId provided', () => {
            const workspaceId = workspaces[1].id;
            const workspace = getters.loadCurrentWorkspace(state)(workspaceId);

            expect(workspace).toMatchObject(workspaces[1]);
        });

        test('it returns the workspace from session storage', () => {
            const workspaceId = workspaces[1].id;
            sessionStorage.setItem('currentWorkspace', workspaceId);
            const workspace = getters.loadCurrentWorkspace(state)();

            sessionStorage.removeItem('currentWorkspace');

            expect(workspace).toMatchObject(workspaces[1]);
        });

        test('it returns the global workspace when no current workspace exists', () => {
            const workspace = getters.loadCurrentWorkspace(state)();

            expect(workspace).toMatchObject(workspaces[0]);
        });

        test('it returns the first workspace in state when no current or global workspace exists', () => {
            const firstWorkspace = workspaces[2];
            const secondWorkspace = workspaces[3];
            const nonGlobalWorkspaces = [ firstWorkspace, secondWorkspace ];
            state = { workspaces: nonGlobalWorkspaces };
            const workspace = getters.loadCurrentWorkspace(state)();

            expect(workspace).toMatchObject(firstWorkspace);
        });
    });
});
