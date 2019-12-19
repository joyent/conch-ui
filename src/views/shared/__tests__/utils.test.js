import * as utils from '../utils.js';
import * as workspaces from '@api/workspaces.js';
import nock from 'nock';
import { conchApi } from '@src/config.js';

// Fixtures
import rackRooms from '@src/__fixtures__/rackRooms.js';
import workspaceRackRooms from '@src/__fixtures__/workspaceRackRooms.js';
import workspaceRacks from '@src/__fixtures__/workspaceRacks.js';

sessionStorage.setItem('token', 'my-token');

describe('utils.js', () => {
    describe('deviceToProgress', () => {
        const date = '2019-03-30T10:15:44.748046-07:00';
        let device;

        beforeEach(() => {
            device = null;
        });

        test('should return "unassigned" if device is null', () => {
            const progress = utils.deviceToProgress(device);
            expect(progress).toEqual('unassigned');
        });

        test('should return "graduated" if device.graduated', () => {
            device = { graduated: date };
            const progress = utils.deviceToProgress(device);
            expect(progress).toEqual('graduated');
        });

        test('should return "validated" if device.validated', () => {
            device = { validated: date };
            const progress = utils.deviceToProgress(device);
            expect(progress).toEqual('validated');
        });

        test('should return "failing" if device.health is "fail"', () => {
            device = { health: 'fail' };
            const progress = utils.deviceToProgress(device);
            expect(progress).toEqual('failing');
        });

        test('should return "active" if device.last_seen is within the last 300 seconds', () => {
            const now = new Date();
            device = { health: 'pass', last_seen: now };
            const progress = utils.deviceToProgress(device);
            expect(progress).toEqual('active');
        });

        test('should return "in progress" if device is not null, graduated, validated, failing or active', () => {
            device = { health: 'pass', last_seen: null };
            const progress = utils.deviceToProgress(device);
            expect(progress).toEqual('in progress');
        });
    });

    describe('getRackRooms', () => {
        test('should return valid rackRoom json structure', () => {
            const rackRooms = utils.getRackRooms(workspaceRacks);
            expect(rackRooms).toMatchObject(workspaceRackRooms);
        });
    });

    describe('getWorkspaceRacks', () => {
        const id = 123;

        nock(conchApi)
            .get(`/workspace/${id}/rack`)
            .reply(200, {});

        test('should call the getWorkspaceRacks API when not available in store', async () => {
            const spy = jest.spyOn(workspaces, 'getWorkspaceRacks');
            await utils.getWorkspaceRacks(id);
            expect(spy).toHaveBeenCalledWith(id);
        });
    });

    describe('roomToProgress', () => {
        test('should return "validated" if device_progress of all rack room racks is "VALID"', () => {
            const progress = utils.roomToProgress(
                rackRooms[Object.keys(rackRooms)[0]]
            );
            expect(progress).toEqual('validated');
        });

        test('should return "in progress" if device_progress of any rack room racks is "PASS"', () => {
            const progress = utils.roomToProgress(
                rackRooms[Object.keys(rackRooms)[1]]
            );
            expect(progress).toEqual('in progress');
        });

        test('should return "failing" if device_progress of any rack room racks is "FAIL"', () => {
            const progress = utils.roomToProgress(
                rackRooms[Object.keys(rackRooms)[2]]
            );
            expect(progress).toEqual('failing');
        });

        test('should return "not started" if device_progress of rack room racks are not "FAIL", "PASS" or "VALID"', () => {
            const progress = utils.roomToProgress(
                rackRooms[Object.keys(rackRooms)[3]]
            );
            expect(progress).toEqual('not started');
        });
    });
});
