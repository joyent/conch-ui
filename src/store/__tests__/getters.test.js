import getters from '../getters.js';

// Fixtures
import activeDevice from '@src/__fixtures__/activeDevice.js';
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

    describe('findWorkspaceById', () => {
        test('it returns the workspace matching the id', () => {
            const workspaceId = workspaces[0].id;
            state = { workspaces };
            const workspace = getters.findWorkspaceById(state)(workspaceId);

            expect(workspace).toMatchObject(workspaces[0]);
        });
    });
});
