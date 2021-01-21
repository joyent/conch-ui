import nock from 'nock';
import { conchApi } from '@src/config';
import * as Users from '../users.js';

// Fixture
import users from '@src/__fixtures__/users.js';

localStorage.setItem('token', 'my-token');

describe('users API', () => {
  let response;
  let user;
  let userId;

  describe('createUser', () => {
    let user;

    beforeEach(() => {
      user = users[0];

      nock(conchApi)
        .post('/user', user)
        .reply(200, user);
    });

    test('should return a status of 200', async () => {
      expect.assertions(1);
      response = await Users.createUser(user);
      expect(response.status).toEqual(200);
    });

    test('should return an object containing the created user', async () => {
      expect.assertions(1);
      response = await Users.createUser(user);
      expect(response.data).toMatchObject(users[0]);
    });
  });

  describe('deactivateUser', () => {
    beforeEach(() => {
      userId = users[0].id;

      nock(conchApi)
        .delete(`/user/${userId}`)
        .reply(204, {});
    });

    test('should return a status of 204', async () => {
      expect.assertions(1);
      response = await Users.deactivateUser(userId);
      expect(response.status).toEqual(204);
    });
  });

  describe('deleteToken', () => {
    let tokenName;

    beforeEach(() => {
      tokenName = 'testToken';

      nock(conchApi)
        .delete(`/user/me/token/${tokenName}`)
        .reply(200, {});
    });

    test('should return a status of 200', async () => {
      expect.assertions(1);
      response = await Users.deleteToken(tokenName);
      expect(response.status).toEqual(200);
    });
  });

  describe('demoteUser', () => {
    beforeEach(() => {
      userId = users[0].id;

      nock(conchApi)
        .post(`/user/${userId}`, { is_admin: false })
        .reply(200, {});
    });

    test('should return a status of 200', async () => {
      expect.assertions(1);
      response = await Users.demoteUser(userId);
      expect(response.status).toEqual(200);
    });
  });

  describe('updateUser', () => {
    let data;

    beforeEach(() => {
      user = users[0];
      userId = user.id;
      data = {
        is_admin: user.is_admin,
        name: user.name,
        email: user.email,
      };

      nock(conchApi)
        .post(`/user/${userId}`, data)
        .reply(200, data);
    });

    test('should return a status of 200', async () => {
      expect.assertions(1);
      const { email, is_admin: isAdmin, name } = user;
      response = await Users.updateUser(userId, email, isAdmin, name);
      expect(response.status).toEqual(200);
    });
  });

  describe('forcePasswordChange', () => {
    beforeEach(() => {
      userId = users[0].id;

      nock(conchApi)
        .delete(`/user/${userId}/password`)
        .reply(200, {});
    });

    test('should return a status of 200', async () => {
      expect.assertions(1);
      response = await Users.forcePasswordChange(userId);
      expect(response.status).toEqual(200);
    });
  });

  describe('getCurrentUser', () => {
    beforeEach(() => {
      nock(conchApi)
        .get('/user/me')
        .reply(200, {});
    });

    test('should return a status of 200', async () => {
      expect.assertions(1);
      response = await Users.getCurrentUser();
      expect(response.status).toEqual(200);
    });
  });

  describe('getToken', () => {
    let tokenName;

    beforeEach(() => {
      tokenName = 'testToken';

      nock(conchApi)
        .get(`/user/me/token/${tokenName}`)
        .reply(200, {});
    });

    test('should return a status of 200', async () => {
      expect.assertions(1);
      response = await Users.getToken(tokenName);
      expect(response.status).toEqual(200);
    });
  });

  describe('getUser', () => {
    beforeEach(() => {
      nock(conchApi)
        .get(`/user/${userId}`)
        .reply(200, {});
    });

    test('should return a status of 200', async () => {
      expect.assertions(1);
      response = await Users.getUser(userId);
      expect(response.status).toEqual(200);
    });
  });

  describe('getUsers', () => {
    beforeEach(() => {
      nock(conchApi)
        .get('/user')
        .reply(200, {});
    });

    test('should return a status of 200', async () => {
      expect.assertions(1);
      response = await Users.getUsers();
      expect(response.status).toEqual(200);
    });
  });

  describe('promoteUser', () => {
    beforeEach(() => {
      userId = users[0].id;

      nock(conchApi)
        .post(`/user/${userId}`, { is_admin: true })
        .reply(200, {});
    });

    test('should return a status of 200', async () => {
      expect.assertions(1);
      response = await Users.promoteUser(userId);
      expect(response.status).toEqual(200);
    });
  });

  describe('updatePassword', () => {
    beforeEach(() => {
      nock(conchApi)
        .post('/user/me/password')
        .reply(200, {});
    });

    test('should return a status of 200', async () => {
      expect.assertions(1);
      response = await Users.updatePassword('zyxwvu');
      expect(response.status).toEqual(200);
    });
  });
});
