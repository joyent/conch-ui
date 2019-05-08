import UserAuthTokens from '../UserAuthTokens.vue';
import Vuex from 'vuex';
import { createLocalVue, mount } from '@vue/test-utils';
import * as users from '@api/users.js';

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
        wrapper.setData({
            tokens: userAuthTokens,
        });
    });

    // Helper functions
    const clickCreateToken = () => {
        wrapper.find('a.add').trigger('click');
    };
    const clickDeleteToken = () => {
        wrapper.find('.delete-token').trigger('click');
    }
    const setTokenName = (name) => {
        wrapper.find('input').setValue(name);
    };
    const saveNewToken = () => {
        wrapper.find('a.create').trigger('click');
    };

    test('should not display modal on initial render', () => {
        expect(wrapper.find('.modal').exists()).toBeFalsy();
    });

    test('should display a confirmation modal when user attempts to delete a token', () => {
        clickDeleteToken();
        expect(wrapper.find('.modal-base').exists()).toBeTruthy();
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
        expect(wrapper.html()).toContain('test 1');
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
        wrapper.setData({ tokens: [] });
        expect(wrapper.html()).toContain('You do not have any tokens.');
    });

    test('should call the closeModal method when modal background is clicked', () => {
        const spy = spyOn(wrapper.vm, 'closeModal');

        clickDeleteToken();
        wrapper.find('.modal-background').trigger('click');

        expect(spy).toHaveBeenCalled();
    });

    test('should not display any success or error messages on initial render', () => {
        expect(wrapper.find('.message').exists()).toBeFalsy();
    });

    test('should call the removeToken method when "Delete Token" button is clicked', () => {
        const spy = spyOn(wrapper.vm, 'removeToken');

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

        await new Promise(resolve => setTimeout(() => {
            expect(wrapper.find('.duplicate-name-error').exists()).toBeTruthy();
            resolve();
        }, 10));
    });

    test('should display a success message when a token is successfully created', async () => {
        clickCreateToken();
        setTokenName('test 1');
        saveNewToken();

        await new Promise(resolve => setTimeout(() => {
            expect(wrapper.find('.message.success').exists()).toBeTruthy();
            resolve();
        }, 10));
    });
});
