import App from '../App.vue';
import Vuex from 'vuex';
import isEmpty from 'lodash/isEmpty';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import VueRouter from 'vue-router';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueRouter);

const router = new VueRouter();

describe('App.vue', () => {
    let actions;
    let getters;
    let state;
    let store;
    let stubs;
    let wrapper;

    beforeEach(() => {
        actions = {
            setActiveDevice: jest.fn(),
            setActiveDeviceDetails: jest.fn(),
            setActiveDeviceSettings: jest.fn(),
            setActiveDeviceValidations: jest.fn(),
            setAllRooms: jest.fn(),
            setCurrentWorkspace: jest.fn(),
            setValidations: jest.fn(),
            setWorkspaces: jest.fn(),
        };
        getters = {
            currentWorkspaceId: jest.fn(),
            loadCurrentWorkspace: jest.fn(),
        };
        state = {};
        stubs = ['router-view'];
        store = new Vuex.Store({ actions, getters, state });
        wrapper = shallowMount(App, { localVue, router, store, stubs });
    });

    describe('SignIn', () => {
        test('should display the SignIn component when path is "/"', () => {
            router.push({ path: '/' });

            expect(wrapper.find('signin-stub').exists()).toBeTruthy();
        });
    });

    describe('PasswordReset', () => {
        test('should display the PasswordReset component when path is "/password-reset"', () => {
            router.push({ path: '/password-reset' });

            expect(wrapper.find('passwordreset-stub').exists()).toBeTruthy();
        });
    });

    describe('Main layout', () => {
        describe('path is "/user"', () => {
            beforeEach(() => {
                router.push({ path: '/user' });
            });

            test('should display the navbar router-view component', () => {
                const navbar = wrapper.findAll('router-view-stub').filter(view => {
                    return view.attributes('name') === 'navbar';
                });

                expect(navbar.exists()).toBeTruthy();
            });

            test('should display the sidebar router-view component', () => {
                const navbar = wrapper.findAll('router-view-stub').filter(view => {
                    return view.attributes('name') === 'sidebar';
                });

                expect(navbar.exists()).toBeTruthy();
            });

            test('should display an unnamed router-view component for the main component', () => {
                const component = wrapper.findAll('router-view-stub').filter(view => {
                    return isEmpty(view.attributes());
                });

                expect(component.exists()).toBeTruthy();
            });
        });

        describe('path contains currentWorkspace', () => {
            test('should display the navbar router-view component', () => {
                const navbar = wrapper.findAll('router-view-stub').filter(view => {
                    return view.attributes('name') === 'navbar';
                });

                expect(navbar.exists()).toBeTruthy();
            });

            test('should display the sidebar router-view component', () => {
                const navbar = wrapper.findAll('router-view-stub').filter(view => {
                    return view.attributes('name') === 'sidebar';
                });

                expect(navbar.exists()).toBeTruthy();
            });

            test('should display an unnamed router-view component for the main component', () => {
                const component = wrapper.findAll('router-view-stub').filter(view => {
                    return isEmpty(view.attributes());
                });

                expect(component.exists()).toBeTruthy();
            });
        });
    });

    describe.skip('Page refresh/reload correct data', () => {
        // localStorage.setItem('token', 'my-token');
        // jest.mock('../api/request.js');
        // jest.mock('../api/authentication.js');
        // const auth = jest.genMockFromModule('../api/authentication.js');
        // auth.isLoggedIn = jest.fn(() => true);
    });
});
