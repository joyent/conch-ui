import UserProfile from '../UserProfile.vue';
import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock('../../../api/request.js');

describe('UserProfile.vue', () => {
    let mocks;
    let state;
    let store;
    let wrapper;

    beforeEach(() => {
        mocks = { $router: [] };
        state = {};
        store = new Vuex.Store({ state });
        wrapper = shallowMount(UserProfile, { localVue, mocks, store });
    });

    // Helper function
    const savePassword = (pwd = '') => {
        wrapper.find('input.password').setValue(pwd);
        wrapper.find('input.confirmation').setValue(pwd);
        wrapper.find('button.save').trigger('click');
    };

    test('should render correctly on inital render', () => {
        expect(wrapper.html()).toMatchSnapshot();
    });

    test('should call the savePassword method when a valid password is entered', () => {
        const spy = jest.spyOn(wrapper.vm, 'savePassword');

        savePassword('abcdefg');

        expect(spy).toHaveBeenCalled();
    });

    test('should not display warning when a valid password is entered', () => {
        savePassword('abcdefg');

        expect(wrapper.find('.message.is-danger').exists()).toEqual(false);
    })

    test('should display password mismatch warning when password does not match confirmation', () => {
        wrapper.find('input.password').setValue('abcdefg');
        wrapper.find('input.confirmation').setValue();
        wrapper.find('button.save').trigger('click');

        expect(wrapper.html()).toContain('The passwords you entered do not match.');
    });

    test('should display password length warning when password is too short', () => {
        savePassword();

        expect(wrapper.html()).toContain('Passwords must contain at least 5 characters.');
    });

    test('should close the warning when the close button is clicked', () => {
        savePassword();

        wrapper.find('button.delete').trigger('click');

        expect(wrapper.find('.message.is-danger').exists()).toEqual(false);
    });

    test('should remove warning after a valid password is submitted', () => {
        savePassword()
        savePassword('abcdefg');

        expect(wrapper.find('.message.is-danger').exists()).toEqual(false);
    });

    describe('Password Reset Modal', () => {
        let actions;

        beforeEach(() => {
            actions = { clearForcePasswordChange: jest.fn() };
            state = { forcePasswordChange: true };
            store = new Vuex.Store({ actions, state });
            wrapper = shallowMount(UserProfile, { localVue, mocks, store });
        });

        test('should display the forcePasswordChange modal when forcePasswordChange is true', () => {
            expect(wrapper.find('.modal').exists()).toBeTruthy();
        });

        test('should close modal when modal background is clicked', () => {
            wrapper.find('.modal-background').trigger('click');

            expect(wrapper.find('.modal').exists()).toBeFalsy();
        });

        test('should close modal when close (x) button is clicked', () => {
            wrapper.find('button.delete').trigger('click');

            expect(wrapper.find('.modal').exists()).toBeFalsy();
        });

        test('should close modal when the Update Password button is clicked', () => {
            wrapper.find('.update-password').trigger('click');

            expect(wrapper.find('.modal').exists()).toBeFalsy();
        });
    });
});
