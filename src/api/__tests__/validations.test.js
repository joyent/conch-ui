import nock from 'nock';
import { conchApi } from '@src/config';
import { getValidations } from '../validations';

// Fixture
import validations from '@src/__fixtures__/validations.js';

localStorage.setItem('token', 'my-token');

describe('validations API', () => {
  describe('getValidations', () => {
    let response;

    beforeEach(() => {
      response = {};

      nock(conchApi)
        .get('/validation')
        .reply(200, validations);
    });

    test('should return a status of 200', async () => {
      expect.assertions(1);
      response = await getValidations();
      expect(response.status).toEqual(200);
    });

    test('should return valid data', async () => {
      expect.assertions(2);
      response = await getValidations();
      const validations = response.data;
      expect(typeof validations).toBe('object');
      expect(Array.isArray(validations)).toBeTruthy();
    });
  });
});
