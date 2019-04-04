import App from '../App.vue';
import Vuex from 'vuex';
import isEmpty from 'lodash/isEmpty';
import { createLocalVue, shallowMount } from '@vue/test-utils';

// Fixture
import workspaces from '../__fixtures__/workspaces.js';
import { rackLayout } from '../__fixtures__/rackLayout';
import devices from '../__fixtures__/devices';
import allRooms from '../__fixtures__/allRooms';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('App.vue', () => {
    let actions;
    let getters;
    let mocks;
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
        mocks = {
            $route: {
                params: {
                    currentWorkspace: workspaces[0].id,
                    deviceId: devices[0].id,
                    rackId: rackLayout.id,
                    roomName: allRooms[0].name,
                },
                path: '',
            },
        };
        state = { workspaces };
        stubs = ['router-view'];
        store = new Vuex.Store({ actions, getters, state });
        wrapper = shallowMount(App, { localVue, mocks, store, stubs });
    });

    describe('SignIn', () => {
        test('should display the SignIn component when path is "/"', () => {
            mocks.$route.path = '/';

            expect(wrapper.find('signin-stub').exists()).toBeTruthy();
        });
    });

    describe('PageNotFound (404)', () => {
        test('should display the PageNotFound component when user 404s', () => {
            mocks.$route.params.currentWorkspace = '';
            mocks.$route.path = '/user/apple';

            expect(wrapper.find('pagenotfound-stub').exists()).toBeTruthy();
        });
    });

    describe('Main layout', () => {
        describe('path is "/user"', () => {
            beforeEach(() => {
                mocks.$route.path = '/user';
            });

            test('should display the navbar router-view component', () => {
                const navbar = wrapper.findAll('router-view-stub').filter(view => {
                    return view.attributes('name') === 'navbar';
                });

                expect(navbar.exists()).toBeTruthy();
            });

            test('should display the sidebar router-view component', () => {
                mocks.$route.path = '/user';
                const navbar = wrapper.findAll('router-view-stub').filter(view => {
                    return view.attributes('name') === 'sidebar';
                });

                expect(navbar.exists()).toBeTruthy();
            });

            test('should display an unnamed router-view component for the main component', () => {
                mocks.$route.path = '/user';
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
        // sessionStorage.setItem('token', 'my-token');
        // jest.mock('../api/request.js');
        // jest.mock('../api/authentication.js');
        // const auth = jest.genMockFromModule('../api/authentication.js');
        // auth.isLoggedIn = jest.fn(() => true);
    });
});
