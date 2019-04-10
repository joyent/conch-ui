import mutations from '../mutations.js';

// Fixtures
import activeDevice from '@src/__fixtures__/activeDevice.js';
import activeRoom from '@src/__fixtures__/activeRoom.js';
import allRooms from '@src/__fixtures__/allRooms.js';
import authTokens from '@src/__fixtures__/authTokens.js';
import deviceDetails from '@src/__fixtures__/deviceDetails.js';
import deviceSettings from '@src/__fixtures__/deviceSettings.js';
import deviceValidations from '@src/__fixtures__/deviceValidations.js';
import devicesByWorkspaceId from '@src/__fixtures__/devicesByWorkspace.js';
import hardwareProducts from '@src/__fixtures__/hardwareProducts.js';
import rackLayout from '@src/__fixtures__/rackLayout.js';
import rackRooms from '@src/__fixtures__/rackRooms.js';
import rackRoomsByWorkspaceId from '@src/__fixtures__/rackRoomsByWorkspace.js';
import validations from '@src/__fixtures__/validations.js';
import workspaces from '@src/__fixtures__/workspaces.js';

describe('mutations', () => {
    let state;

    beforeEach(() => {
        state = {};
    });

    describe('clearActiveDevice', () => {
        test('it clears the active device currently in state', () => {
            state = { activeDevice };

            mutations.clearActiveDevice(state);
            expect(state).toMatchObject({ activeDevice: {} });
        });
    });

    describe('clearActiveRoom', () => {
        test('it clears the active room currently in state', () => {
            state = { activeRoom };

            mutations.clearActiveRoom(state);
            expect(state).toMatchObject({ activeRoom: {} });
        });
    });

    describe('clearForcePasswordChange', () => {
        test('it clears forcePasswordChange by setting it to false', () => {
            state = { forcePasswordChange: true };
            mutations.clearForcePasswordChange(state);

            expect(state).toMatchObject({ forcePasswordChange: false });
        });
    });

    describe('clearRackLayout', () => {
        test('it clears rackLayout', () => {
            state = { rackLayout };

            mutations.clearRackLayout(state);
            expect(state).toMatchObject({ rackLayout: {} });
        });
    });

    describe('clearShowDeviceInRack', () => {
        test('it clears showDeviceInRack by setting it to false', () => {
            state = { showDeviceInRack: true };

            mutations.clearShowDeviceInRack(state);
            expect(state).toMatchObject({ showDeviceInRack: false });
        });
    });

    describe('setActiveDevice', () => {
        test('it adds an active device to the state', () => {
            state = { activeDevice: {} };

            mutations.setActiveDevice(state, activeDevice);
            expect(state).toMatchObject({ activeDevice });
        });
    });

    describe('setActiveDeviceDetails', () => {
        test('it adds active device details to the state', () => {
            state = { activeDeviceDetails: {} };

            mutations.setActiveDeviceDetails(state, deviceDetails);
            expect(state).toMatchObject({ activeDeviceDetails: deviceDetails });
        });
    });

    describe('setActiveDeviceSettings', () => {
        test('it adds active device settings to the state', () => {
            state = { activeDeviceSettings: {} };

            mutations.setActiveDeviceSettings(state, deviceSettings);
            expect(state).toMatchObject({ activeDeviceSettings: deviceSettings });
        });
    });

    describe('setActiveDeviceValidations', () => {
        test('it adds active device validations to the state', () => {
            state = { activeDeviceValidations: [] };

            mutations.setActiveDeviceValidations(state, deviceValidations);
            expect(state).toMatchObject({ activeDeviceValidations: deviceValidations });
        });
    });

    describe('setActiveRoom', () => {
        test('it adds an active room to the state', () => {
            state = { activeRoom: {} };

            mutations.setActiveRoom(state, activeRoom);
            expect(state).toMatchObject({ activeRoom });
        });
    });

    describe('setAllRooms', () => {
        test('it adds all rackrooms from the specified workspace to the state', () => {
            state = { allRooms: [] };

            mutations.setAllRooms(state, allRooms);
            expect(state).toMatchObject({ allRooms });
        });
    });

    describe('setAuthTokens', () => {
        test('it adds authentication tokens to the state', () => {
            state = { authTokens: [] };

            mutations.setAuthTokens(state, authTokens);
            expect(state).toMatchObject({ authTokens });
        });
    });

    describe('setCurrentWorkspace', () => {
        test('it adds the current workspace to the state', () => {
            const currentWorkspace = workspaces[0];
            state = { currentWorkspace: {} };

            mutations.setCurrentWorkspace(state, currentWorkspace);
            expect(state).toMatchObject({ currentWorkspace });
        });
    });

    describe('setDevicesByWorkspace', () => {
        test('it adds devices for a specified workspace to state', () => {
            const workspaceId = workspaces[0].id;
            const devicesByWorkspace = devicesByWorkspaceId.find(workspace => {
                return Object.keys(workspace)[0] === workspaceId;
            })
            state = { devicesByWorkspace: [] };

            mutations.setDevicesByWorkspace(state, devicesByWorkspace);
            expect(state).toMatchObject({ devicesByWorkspace: [devicesByWorkspace] });
        });
    });

    describe('setForcePasswordChange', () => {
        test('it sets forcePasswordChange by setting it to true', () => {
            const forcePasswordChange = true;
            state = { forcePasswordChange: false };

            mutations.setForcePasswordChange(state, forcePasswordChange);
            expect(state).toMatchObject({ forcePasswordChange });
        });
    });

    describe('setHardwareProducts', () => {
        test('it adds hardware products to state', () => {
            state = { hardwareProducts: [] };

            mutations.setHardwareProducts(state, hardwareProducts);
            expect(state).toMatchObject({ hardwareProducts });
        });
    });

    describe('setHighlightDeviceId', () => {
        test('it adds highlightDeviceId which is a searched device to the state', () => {
            const highlightDeviceId = activeDevice.id;
            state = { highlightDeviceId: '' };

            mutations.setHighlightDeviceId(state, highlightDeviceId);
            expect(state).toMatchObject({ highlightDeviceId });
        });
    });

    describe('setRackLayout', () => {
        test('it adds a rack layout which is the active rack to the state', () => {
            state = { rackLayout: {} };

            mutations.setRackLayout(state, rackLayout);
            expect(state).toMatchObject({ rackLayout });
        });
    });

    describe('setRackRooms', () => {
        test('it adds rack rooms to the state', () => {
            state = { rackRooms: {} };

            mutations.setRackRooms(state, rackRooms);
            expect(state).toMatchObject({ rackRooms });
        });
    });

    describe('setRackRoomsByWorkspace', () => {
        test('it adds rack rooms for a specified workspace to the state', () => {
            const workspaceId = workspaces[0].id;
            const rackRoomsByWorkspace = rackRoomsByWorkspaceId.find(workspace => {
                return Object.keys(workspace)[0] === workspaceId;
            });
            state = { rackRoomsByWorkspace: [] };

            mutations.setRackRoomsByWorkspace(state, rackRoomsByWorkspace);
            expect(state).toMatchObject({ rackRoomsByWorkspace: [rackRoomsByWorkspace] });
        });
    });

    describe('setShowDeviceInRack', () => {
        test('it sets a boolean value when showing a device in rack to the state', () => {
            const showDeviceInRack = true;
            state = { showDeviceInRack: false };

            mutations.setShowDeviceInRack(state, showDeviceInRack);
            expect(state).toMatchObject({ showDeviceInRack });
        });
    });

    describe('setWorkspaces', () => {
        test('it adds workspaces to the state', () => {
            state = { workspaces: [] };

            mutations.setWorkspaces(state, workspaces);
            expect(state).toMatchObject({ workspaces });
        });
    });

    describe('setValidations', () => {
        test('it adds validations to the state', () => {
            state = { validations: [] };

            mutations.setValidations(state, validations);
            expect(state).toMatchObject({ validations });
        });
    });
});
