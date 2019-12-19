import getters from '../getters.js';

// Fixtures
import activeDevice from '@src/__fixtures__/activeDevice.js';
import devicesByWorkspaceId from '@src/__fixtures__/devicesByWorkspace.js';
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
            const rackRooms = getters.getRackRoomsByWorkspace(state)(
                workspaceId
            );

            expect(rackRooms).toMatchObject(rackRoomsByWorkspaceId[0]);
        });
    });
});
