import AuthenticationTokens from '../AuthenticationTokens.vue';
import Vuex from 'vuex';
import { createLocalVue, mount } from '@vue/test-utils';
import * as usersApi from '@api/users.js';

// Fixtures
import authTokens from '@src/__fixtures__/authTokens.js';
import userAuthTokens from '@src/__fixtures__/userAuthTokens.js';
import users from '@src/__fixtures__/users.js';

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock('@api/request.js');

describe('AuthenticationTokens.vue', () => {
    let actions;
    let mocks;
    let state;
    let store;
    let wrapper;

    beforeEach(() => {
        actions = {
            setAuthTokens: jest.fn(),
            setUserAuthTokens: jest.fn(),
            setUsers: jest.fn() ,
        };
        mocks = { $router: [] };
        state = { authTokens, currentUser: users[0], users };
        store = new Vuex.Store({ actions, state });
        wrapper = mount(AuthenticationTokens, { localVue, mocks, store });
    });

    describe('users page', () => {
        test('should display a loading indicator until the user list has been fetched from the API', () => {
            state.users = [];
            store = new Vuex.Store({ actions, state });
            wrapper = mount(AuthenticationTokens, { localVue, mocks, store });

            expect(wrapper.find('.spinner').exists()).toBeTruthy();
        });

        test('should display a table of users when the list has been fetched from the API', () => {
            expect(wrapper.find('table').exists()).toBeTruthy();
        });

        test('should display a table row for each user returned from the API', () => {
            const userCount = users.length;
            const rowCount = wrapper.findAll('tr').length;

            expect(userCount).toEqual(rowCount);
        });

        test('should display the name of the user associated with the table row', () => {
            expect(wrapper.find('td.username').text()).toEqual(users[0].name);
        });

        test('should filter displayed user results when search text is entered into search input field', () => {
            wrapper.find('input.search').setValue('another');

            expect(wrapper.findAll('tr').length).toEqual(1);
        });

        test('should sort displayed user results when "Name" header is clicked', () => {
            wrapper.find('.table-header-filter').trigger('click');

            expect(wrapper.find('.username').text()).toEqual(users[1].name);
        });

        test('should reverse sort displayed user results when "Name" header is clicked', () => {
            wrapper.find('.table-header-filter').trigger('click');
            wrapper.find('.table-header-filter').trigger('click');

            expect(wrapper.find('.username').text()).toEqual(users[0].name);
        });

        describe('delete login tokens modals', () => {
            // Helper function
            const clickDeleteLoginTokens = () => {
                wrapper.find('.delete-login-tokens').trigger('click');
            };

            test('should display a modal when "Login Tokens" button is clicked', () => {
                clickDeleteLoginTokens();

                expect(wrapper.find('.modal-base').exists).toBeTruthy();
            });

            test('should display informative confirmation text on the delete login tokens modal about what action is being taken', () => {
                const expectedText = `Are you sure you want to delete the login tokens for ${users[0].name}?`
                clickDeleteLoginTokens();

                expect(wrapper.find('.modal-content .subtitle').text()).toEqual(expectedText);
            });

            test('should close the modal when the modal background is clicked', () => {
                clickDeleteLoginTokens();
                wrapper.find('.modal-background').trigger('click');

                expect(wrapper.find('.modal-base').exists()).toBeFalsy();
            });

            test('should close the modal when the modal close button (x) is clicked', () => {
                clickDeleteLoginTokens();
                wrapper.find('.modal-base button.delete').trigger('click');

                expect(wrapper.find('.modal-base').exists()).toBeFalsy();
            });

            test('should display button with text "Delete Login Tokens" on the modal', () => {
                clickDeleteLoginTokens();

                expect(wrapper.find('a.confirm').text()).toEqual('Delete Login Tokens');
            });

            test('should call the deleteUserTokens method with the userId and login_only: 1 as params', () => {
                const spy = jest.spyOn(usersApi, 'deleteUserTokens');
                const userId = users[0].id;
                const params = { login_only: 1 };

                clickDeleteLoginTokens();
                wrapper.find('a.confirm').trigger('click');

                expect(spy).toHaveBeenCalledWith(userId, params);
            });

            test('should display a modal with a success message if login tokens are successfully deleted', () => {
                const successText = `${users[0].name}'s login tokens have been deleted.`;
                jest.spyOn(usersApi, 'deleteUserTokens').mockResolvedValueOnce(true);

                clickDeleteLoginTokens();
                wrapper.find('a.confirm').trigger('click');

                wrapper.vm.$nextTick(() => {
                    expect(wrapper.find('.modal-base .subtitle').text()).toEqual(successText);
                });
            });

            test('should display a table containing tokens for the selected user when "Auth Tokens" button is clicked', () => {
                store = new Vuex.Store({ actions, state });
                wrapper = mount(AuthenticationTokens, { localVue, mocks, store });

                wrapper.find('.view-auth-tokens').trigger('click');

                expect(wrapper.find('.authentication-tokens-table').exists()).toBeTruthy();
            });
        });
    });

    describe('auth tokens page', () => {
        beforeEach(() => {
            wrapper.setData({
                selectedUser: users[0],
                viewTokens: true,
                viewUsers: false,
            });
        });

        test('should display the username of the selected user at the top of the page', () => {
            expect(wrapper.find('.selected-user .username').text()).toEqual(users[0].name);
        });

        test('should display a table row for each token returned by the API', () => {
            wrapper.setData({ sortedTokens: userAuthTokens });

            const authTokenCount = userAuthTokens.length;
            const rowCount = wrapper.findAll('tr').length;

            expect(authTokenCount).toEqual(rowCount);
        });

        test('should display a notification of "User does not have tokens" if the selected user has no tokens', () => {
            wrapper.setData({ sortedTokens: [] });
            const noTokensText = `${users[0].name} does not have any auth tokens.`;

            expect(wrapper.find('.no-tokens').text()).toEqual(noTokensText);
        });

        test('should not display a "Delete Auth Tokens" button if the selected user has no tokens', () => {
            wrapper.setData({ sortedTokens: [] });

            expect(wrapper.find('a.delete-auth-tokens').exists()).toBeFalsy();
        });

        test('should display the user list when "Back to User List" button is clicked', () => {
            wrapper.find('a.close-token-list').trigger('click');

            expect(wrapper.find('.auth-users-table').exists()).toBeTruthy();
        });

        describe('filtering and sorting', () => {
            const firstAuthTokenName = userAuthTokens[0].name;
            const fourthAuthTokenName = userAuthTokens[3].name;

            beforeEach(() => {
                wrapper.setData({ sortedTokens: userAuthTokens });
            });

            test('should filter displayed token results when search text is entered into search input field', () => {
                wrapper.find('input.search').setValue('apple');
                const rows = wrapper.findAll('tr');

                expect(rows.length).toEqual(1);
                expect(wrapper.find('.token-name').text()).toEqual(firstAuthTokenName);
            });

            test('should sort displayed user results when "Name" header is clicked', () => {
                wrapper.find('.table-header-filter').trigger('click');

                expect(wrapper.find('.token-name').text()).toEqual(firstAuthTokenName);
            });

            test('should reverse sort displayed user results when "Name" header is clicked', () => {
                wrapper.find('.table-header-filter').trigger('click');
                wrapper.find('.table-header-filter').trigger('click');

                expect(wrapper.find('.token-name').text()).toEqual(fourthAuthTokenName);
            });

            test('should sort displayed user results when "Last Used" header is clicked', () => {
                wrapper.findAll('.table-header-filter').at(1).trigger('click');

                expect(wrapper.find('.token-name').text()).toEqual(fourthAuthTokenName);
            });

            test('should sort displayed user results when "Created" header is clicked', () => {
                wrapper.findAll('.table-header-filter').at(2).trigger('click');

                expect(wrapper.find('.token-name').text()).toEqual(userAuthTokens[2].name);
            });
        });

        describe('view auth tokens modals', () => {
            beforeEach(() => {
                wrapper.setData({
                    sortedTokens: userAuthTokens
                });
            });

            // Helper functions
            const clickConfirmButton = () => {
                wrapper.find('a.confirm').trigger('click');
            };
            const clickDeleteTokenButton = () => {
                wrapper.find('.delete-token').trigger('click');
            };
            const clickDeleteAuthTokensButton = () => {
                wrapper.find('.delete-auth-tokens').trigger('click');
            };

            test('should display a confirmation modal when the delete token button on a token row is clicked', () => {
                clickDeleteTokenButton();

                expect(wrapper.find('.modal-base').exists()).toBeTruthy();
            });

            test('should display the name of the token being deleted on the confirmation modal', () => {
                clickDeleteTokenButton();

                expect(wrapper.find('.subtitle').text()).toContain(userAuthTokens[0].name);
            });

            test('should display a button with text "Delete Token" on the modal', () => {
                clickDeleteTokenButton();

                expect(wrapper.find('a.confirm').text()).toEqual('Delete Token');
            });

            test('should call the deleteToken method when "Delete Token" button is clicked', () => {
                const spy = jest.spyOn(usersApi, 'deleteUserToken');
                const tokenName = userAuthTokens[0].name;
                const userId = users[0].id;

                clickDeleteTokenButton();
                clickConfirmButton();

                expect(spy).toHaveBeenCalledWith(tokenName, userId);
            });

            test('should call the deleteUserTokens method with the userId and login_only: 1 as params', () => {
                const spy = jest.spyOn(usersApi, 'deleteUserTokens');
                const params = { api_only: 1 };
                const userId = users[0].id;

                clickDeleteAuthTokensButton();
                clickConfirmButton();

                expect(spy).toHaveBeenCalledWith(userId, params);
            });

            test('should display a modal when the "Delete Auth Tokens" button is clicked ', () => {
                clickDeleteAuthTokensButton();

                expect(wrapper.find('.modal-base').exists).toBeTruthy();
            });

            test('should display informative confirmation text on the delete auth tokens modal', () => {
                const confirmationMessage = `Are you sure you want to delete the auth tokens for ${users[0].name}?`
                clickDeleteAuthTokensButton();

                expect(wrapper.find('.subtitle').text()).toEqual(confirmationMessage);
            });
        });
    });
});
