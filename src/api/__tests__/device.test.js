import nock from 'nock';
import { conchApi } from '../../../config.js';
import * as device from '../../api/device.js';

// Fixtures
import deviceDetails from '@src/__fixtures__/deviceDetails.js';
import deviceLocation from '@src/__fixtures__/deviceLocation.js';
import deviceSettings from '@src/__fixtures__/deviceSettings.js';
import deviceValidations from '@src/__fixtures__/deviceValidations.js';

sessionStorage.setItem('token', 'my-token');

const id = 'JCNWLD2';

describe('device.js API', () => {
    let response;

    beforeEach(() => {
        response = {};
    });

    describe('getDeviceDetails', () => {
        beforeEach(() => {
            nock(conchApi)
                .get(`/device/${id}`)
                .reply(200, deviceDetails);
        });

        test('should return a status of 200', async () => {
            expect.assertions(1);
            response = await device.getDeviceDetails(id);
            expect(response.status).toEqual(200);
        });

        test('should return an object containing device details', async () => {
            expect.assertions(1);
            response = await device.getDeviceDetails(id);
            expect(response.data).toMatchObject(deviceDetails);
        });
    });

    describe('getDevicePhase', () => {
        beforeEach(() => {
            nock(conchApi)
                .get(`/device/${id}/phase`)
                .reply(200);
        });

        test('should return a status of 200', async () => {
            expect.assertions(1);
            response = await device.getDevicePhase(id);
            expect(response.status).toEqual(200);
        });
    });

    describe('getDeviceSettings', () => {
        beforeEach(() => {
            nock(conchApi)
                .get(`/device/${id}/settings`)
                .reply(200, deviceSettings);
        });

        test('should return a status of 200', async () => {
            expect.assertions(1);
            response = await device.getDeviceSettings(id);
            expect(response.status).toEqual(200);
        });

        test('should return an object containing device settings', async () => {
            expect.assertions(1);
            response = await device.getDeviceSettings(id);
            expect(response.data).toMatchObject(deviceSettings);
        });
    });

    describe('getDeviceValidations', () => {
        beforeEach(() => {
            nock(conchApi)
                .get(`/device/${id}/validation_state`)
                .reply(200, deviceValidations);
        });

        test('should return a status of 200', async () => {
            expect.assertions(1);
            const response = await device.getDeviceValidations(id);
            expect(response.status).toEqual(200);
        });

        test('should return an object containing device validations', async () => {
            expect.assertions(1);
            response = await device.getDeviceValidations(id);
            expect(response.data).toMatchObject(deviceValidations);
        });
    });

    describe('getLocation', () => {
        beforeEach(() => {
            nock(conchApi)
                .get(`/device/${id}/location`)
                .reply(200, deviceLocation);
        });

        test('should return a status of 200', async () => {
            expect.assertions(1);
            response = await device.getLocation(id);
            expect(response.status).toEqual(200);
        });

        test('should return an object containing device location', async () => {
            expect.assertions(1);
            response = await device.getLocation(id);
            expect(response.data).toMatchObject(deviceLocation);
        });
    });

    describe('setDevicePhase', () => {
        const data = { phase: 'integration' };

        beforeEach(() => {
            nock(conchApi)
                .post(`/device/${id}/phase`, data)
                .reply(200);
        });

        test('should return a status of 200', async () => {
            expect.assertions(1);
            response = await device.setDevicePhase(id, data);
            expect(response.status).toEqual(200);
        });
    });
});
