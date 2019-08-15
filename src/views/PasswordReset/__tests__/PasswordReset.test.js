import PasswordReset from '../PasswordReset.vue';
import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock('@api/request.js');

describe('PasswordReset.vue', () => {
    let actions;
    let mocks;
    let store;
    let wrapper;

    beforeEach(() => {
        actions = {
            clearForcePasswordChange: jest.fn(),
        };
        mocks = { $router: [] };
        store = new Vuex.Store({ actions });
        wrapper = shallowMount(PasswordReset, { localVue, mocks, store });
    });

    // Helper function
    const savePassword = (pwd = '') => {
        wrapper.find('input.password').setValue(pwd);
        wrapper.find('input.confirmation').setValue(pwd);
        wrapper.find('.button.save').trigger('click');
    };

    test('should render correctly on initial render', () => {
        expect(wrapper.html()).toMatchSnapshot();
    });

    test('should call the savePassword method when a valid password is entered', () => {
        const spy = jest.spyOn(wrapper.vm, 'savePassword');

        savePassword('abcdefg');

        expect(spy).toHaveBeenCalled();
    });

    test('should not display warning when a valid password is entered', () => {
        savePassword('abcdefg');

        expect(wrapper.find('.message.error').exists()).toEqual(false);
    });

    test('should display password mismatch warning when password does not match confirmation', () => {
        wrapper.find('input.password').setValue('abcdefg');
        wrapper.find('input.confirmation').setValue();
        wrapper.find('.button.save').trigger('click');

        expect(wrapper.html()).toContain('The passwords you entered do not');
    });

    test('should display password length warning when password is too short', () => {
        savePassword();

        expect(wrapper.html()).toContain('Passwords must contain at least');
    });

    test('should remove warning after a valid password is submitted', () => {
        savePassword();
        savePassword('abcdefg');

        expect(wrapper.find('.message.error').exists()).toEqual(false);
    });
});
