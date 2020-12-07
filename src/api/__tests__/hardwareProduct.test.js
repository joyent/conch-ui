import { conchApi } from '@src/config.js';
import { getHardwareProduct } from '@api/hardwareProduct.js';
import nock from 'nock';

// Fixture
import hardwareProducts from '@src/__fixtures__/hardwareProducts.js';

localStorage.setItem('token', 'my-token');

describe('hardwareProduct API', () => {
  describe('getHardwareProduct', () => {
    const hardwareProduct = hardwareProducts[0];
    let response;

    beforeEach(() => {
      response = {};

      nock(conchApi)
        .get('/hardware_product')
        .reply(200, hardwareProduct);
    });

    test('should return an object', async () => {
      expect.assertions(2);
      response = await getHardwareProduct();
      expect(response.status).toEqual(200);
      expect(response.data).toMatchObject(hardwareProduct);
    });
  });
});
