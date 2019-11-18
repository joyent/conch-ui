import nock from 'nock';
import { conchApi } from '@src/config.js';
import * as rackApi from '@api/rack.js';

// Fixture
import { rackLayout } from '@src/__fixtures__/rackLayout.js';

localStorage.setItem('token', 'test-token');

describe('rack.js API', () => {
    let data;
    let params;
    let response;

    describe('setRackPhase', () => {
        beforeEach(() => {
            data = { phase: 'integration' };
            params = { rack_only: 0 };
            response = {};

            nock(conchApi)
                .post(`/rack/${rackLayout.id}/phase`, data)
                .query(params)
                .reply(200);
        });

        test('should return a status of 200', async () => {
            expect.assertions(1);
            response = await rackApi.setRackPhase(rackLayout.id, data, params);
            expect(response.status).toEqual(200);
        });
    });
});
