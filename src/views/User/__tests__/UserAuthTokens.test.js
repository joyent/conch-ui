import UserAuthTokens from '../UserAuthTokens.vue';
import Vuex from 'vuex';
import { createLocalVue, mount } from '@vue/test-utils';
import * as users from '@api/users.js';
import moment from 'moment';

// Fixture
import userAuthTokens from '@src/__fixtures__/userAuthTokens.js';

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock('@src/api/request.js');

describe('UserAuthTokens.vue', () => {
    let actions;
    let state;
    let store;
    let mocks;
    let wrapper;

    beforeEach(() => {
        actions = { setUserAuthTokens: jest.fn() };
        state = { userAuthTokens: [] };
        store = new Vuex.Store({ actions, state });
        mocks = { $nextTick: jest.fn() };
        wrapper = mount(UserAuthTokens, { localVue, mocks, store });
        wrapper.setData({ sortedTokens: userAuthTokens });
    });

    // Helper functions
    const clickCreateToken = () => {
        wrapper.find('a.add').trigger('click');
    };

    const clickDeleteToken = () => {
        wrapper.find('.delete-token').trigger('click');
    };

    const setTokenName = name => {
        wrapper.find('input').setValue(name);
    };

    const saveNewToken = () => {
        wrapper.find('a.create').trigger('click');
    };

    describe('table row sorting', () => {
        let sortBySpy;

        beforeEach(() => {
            wrapper.setData({ sortedTokens: userAuthTokens });
            sortBySpy = jest.spyOn(wrapper.vm, 'sortBy');
        });

        const clickNameHeader = () => {
            wrapper.find('.table-header-filter.token-name').trigger('click');
        };

        const clickLastUsedHeader = () => {
            wrapper.find('.table-header-filter.last-used').trigger('click');
        };

        const clickCreatedHeader = () => {
            wrapper.find('.table-header-filter.created').trigger('click');
        };

        test('should call the sortBy method when the "Name" table header is clicked', () => {
            clickNameHeader();

            expect(sortBySpy).toHaveBeenCalled();
        });

        test('should call the sortBy method when the "Last Used" table header is clicked', () => {
            clickLastUsedHeader();

            expect(sortBySpy).toHaveBeenCalled();
        });

        test('should call the sortBy method when the "Created" table header is clicked', () => {
            clickCreatedHeader();

            expect(sortBySpy).toHaveBeenCalled();
        });

        test('should reverse sort the tokens by "name" when "Name" table header is clicked twice', async () => {
            // First click sorts table by token name alphabetically
            clickNameHeader();
            clickNameHeader();

            expect(
                wrapper
                    .findAll('.token .token-name')
                    .at(0)
                    .text()
            ).toEqual(userAuthTokens[3].name);
        });

        test('should sort the tokens by "last_used" when "Last Used" table header is clicked', () => {
            clickLastUsedHeader();

            const lastUsed = moment(userAuthTokens[3].last_used).fromNow();

            expect(
                wrapper
                    .findAll('.token .last-used')
                    .at(0)
                    .text()
            ).toEqual(lastUsed);
        });

        test('should sort the tokens by "created" when "Created" table header is clicked', () => {
            clickCreatedHeader();

            const created = moment(userAuthTokens[3].created).fromNow();

            expect(
                wrapper
                    .findAll('.token .created')
                    .at(0)
                    .text()
            ).toEqual(created);
        });
    });

    test('should not display modal on initial render', () => {
        expect(wrapper.find('.modal').exists()).toBeFalsy();
    });

    test('should display spinner if tokens are still being retrieved from the API', () => {
        wrapper.setData({ sortedTokens: [], noTokens: false });

        expect(wrapper.find('.spinner').exists()).toBeTruthy();
    });

    test('should display a confirmation modal when user attempts to delete a token', () => {
        clickDeleteToken();
        expect(wrapper.find('.base-modal').exists()).toBeTruthy();
    });

    test('should not display any input fields on initial render', () => {
        expect(wrapper.find('input').exists()).toBeFalsy();
    });

    test('should display an input field after user clicks "Add Token" button', () => {
        clickCreateToken();
        expect(wrapper.find('input').exists()).toBeTruthy();
    });

    test('should remove the input field when user clicks "Cancel" button', () => {
        clickCreateToken();
        wrapper.find('a.cancel').trigger('click');

        expect(wrapper.find('input').exists()).toBeFalsy();
    });

    test('should display tokens added by the user', () => {
        expect(wrapper.html()).toContain(userAuthTokens[0].name);
    });

    test('should call createToken when valid token name is submitted', () => {
        const spy = jest.spyOn(users, 'createToken');

        clickCreateToken();
        setTokenName('abcdefg');
        saveNewToken();

        expect(spy).toHaveBeenCalled();
    });

    test('should not call createToken if an empty token name is submitted', () => {
        const spy = jest.spyOn(users, 'createToken');

        clickCreateToken();
        setTokenName('');
        saveNewToken();

        expect(spy).not.toHaveBeenCalled();
    });

    test('should not display any token details on initial render', () => {
        wrapper.setData({ sortedTokens: [] });
        expect(wrapper.html()).toContain('You do not have any tokens.');
    });

    test('should call the closeModal method when modal background is clicked', () => {
        const spy = jest.spyOn(wrapper.vm, 'closeModal');

        clickDeleteToken();
        wrapper.find('.modal-background').trigger('click');

        expect(spy).toHaveBeenCalled();
    });

    test('should not display any success or error messages on initial render', () => {
        expect(wrapper.find('.message').exists()).toBeFalsy();
    });

    test('should call the removeToken method when "Delete Token" button is clicked', () => {
        const spy = jest.spyOn(wrapper.vm, 'removeToken');

        clickDeleteToken();
        wrapper.find('a.confirm').trigger('click');

        expect(spy).toHaveBeenCalled();
    });

    test('should display an error message when a duplicate token name is submitted', async () => {
        jest.spyOn(users, 'createToken').mockRejectedValueOnce({
            data: {
                error: 'name "test 1" is already in use',
            },
            status: 400,
        });

        clickCreateToken();
        setTokenName('test 1');
        saveNewToken();

        await new Promise(resolve =>
            setTimeout(() => {
                expect(
                    wrapper.find('.duplicate-name-error').exists()
                ).toBeTruthy();
                resolve();
            }, 10)
        );
    });

    test('should display a success message when a token is successfully created', async () => {
        clickCreateToken();
        setTokenName('test 1');
        saveNewToken();

        await new Promise(resolve =>
            setTimeout(() => {
                expect(wrapper.find('.message.success').exists()).toBeTruthy();
                resolve();
            }, 10)
        );
    });
});
