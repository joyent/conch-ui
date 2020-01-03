import getters from '../getters.js';

// Fixtures
import activeDevice from '@src/__fixtures__/activeDevice.js';

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
});
