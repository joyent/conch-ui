import actions from '../actions.js';

describe('actions', () => {
    const commit = jest.fn();

    describe('clearActiveDevice', () => {
        test('it clears the active device', () => {
            actions.clearActiveDevice({ commit }, {});
            expect(commit).toHaveBeenCalledWith('clearActiveDevice');
        });
    });

    describe('clearActiveRoom', () => {
        test('it clears the active room', () => {
            actions.clearActiveRoom({ commit }, {});
            expect(commit).toHaveBeenCalledWith('clearActiveRoom');
        });
    });

    describe('clearForcePasswordChange', () => {
        test('it clears forcePasswordChange', () => {
            actions.clearForcePasswordChange({ commit }, {});
            expect(commit).toHaveBeenCalledWith('clearForcePasswordChange');
        });
    });

    describe('clearRackLayout', () => {
        test('it clears the active rack', () => {
            actions.clearRackLayout({ commit }, {});
            expect(commit).toHaveBeenCalledWith('clearRackLayout');
        });
    });

    describe('clearShowDeviceInRack', () => {
        test('it resets the boolean showDeviceInRack to false', () => {
            actions.clearShowDeviceInRack({ commit }, {});
            expect(commit).toHaveBeenCalledWith('clearShowDeviceInRack');
        });
    });

    describe('setActiveDevice', () => {
        test('it sets the active device', () => {
            actions.setActiveDevice({ commit }, {});
            expect(commit).toHaveBeenCalledWith('setActiveDevice', {});
        });
    });

    describe('setActiveDeviceDetails', () => {
        test('it sets the active device details', () => {
            actions.setActiveDeviceDetails({ commit }, {});
            expect(commit).toHaveBeenCalledWith('setActiveDeviceDetails', {});
        });
    });

    describe('setActiveDeviceSettings', () => {
        test('it sets the active device settings', () => {
            actions.setActiveDeviceSettings({ commit }, {});
            expect(commit).toHaveBeenCalledWith('setActiveDeviceSettings', {});
        });
    });

    describe('setActiveDeviceValidations', () => {
        test('it sets the active device validations', () => {
            actions.setActiveDeviceValidations({ commit }, {});
            expect(commit).toHaveBeenCalledWith('setActiveDeviceValidations', {});
        });
    });

    describe('setActiveRoom', () => {
        test('it sets the active room', () => {
            actions.setActiveRoom({ commit }, {});
            expect(commit).toHaveBeenCalledWith('setActiveRoom', {});
        });
    });

    describe('setAllRooms', () => {
        test('it sets all rooms', () => {
            actions.setAllRooms({ commit }, {});
            expect(commit).toHaveBeenCalledWith('setAllRooms', {});
        });
    });

    describe('setAuthTokens', () => {
        test('it sets authentication tokens', () => {
            actions.setAuthTokens({ commit }, []);
            expect(commit).toHaveBeenCalledWith('setAuthTokens', []);
        });
    });

    describe('setCurrentWorkspace', () => {
        test('it sets the current workspace', () => {
            actions.setCurrentWorkspace({ commit }, {});
            expect(commit).toHaveBeenCalledWith('setCurrentWorkspace', {});
        });
    });

    describe('setDevicesByWorkspace', () => {
        test('it sets devices by workspace', () => {
            actions.setDevicesByWorkspace({ commit }, {});
            expect(commit).toHaveBeenCalledWith('setDevicesByWorkspace', {});
        });
    });

    describe('setForcePasswordChange', () => {
        test('it sets forcePasswordChange', () => {
            actions.setForcePasswordChange({ commit }, {});
            expect(commit).toHaveBeenCalledWith('setForcePasswordChange');
        });
    });

    describe('setHardwareProducts', () => {
        test('it sets hardware products', () => {
            actions.setHardwareProducts({ commit }, {});
            expect(commit).toHaveBeenCalledWith('setHardwareProducts', {});
        });
    });

    describe('setHighlightDeviceId', () => {
        test('it sets the hilighted deviceId', () => {
            actions.setHighlightDeviceId({ commit }, {});
            expect(commit).toHaveBeenCalledWith('setHighlightDeviceId', {});
        });
    });

    describe('setRackLayout', () => {
        test('it sets the rack layout', () => {
            actions.setRackLayout({ commit }, {});
            expect(commit).toHaveBeenCalledWith('setRackLayout', {});
        });
    });

    describe('setRackRooms', () => {
        test('it sets the rack rooms', () => {
            actions.setRackRooms({ commit }, {});
            expect(commit).toHaveBeenCalledWith('setRackRooms', {});
        });
    });

    describe('setRackRoomsByWorkspace', () => {
        test('it sets the rack rooms by workspace', () => {
            actions.setRackRoomsByWorkspace({ commit }, {});
            expect(commit).toHaveBeenCalledWith('setRackRoomsByWorkspace', {});
        });
    });

    describe('setShowDeviceInRack', () => {
        test('it sets the boolean showDeviceInRack to true', () => {
            actions.setShowDeviceInRack({ commit }, {});
            expect(commit).toHaveBeenCalledWith('setShowDeviceInRack', {});
        });
    });

    describe('setWorkspaces', () => {
        test('it sets the workspaces', () => {
            actions.setWorkspaces({ commit }, {});
            expect(commit).toHaveBeenCalledWith('setWorkspaces', {});
        });
    });

    describe('setValidations', () => {
        test('it sets the validations', () => {
            actions.setValidations({ commit }, {});
            expect(commit).toHaveBeenCalledWith('setValidations', {});
        });
    });
});
