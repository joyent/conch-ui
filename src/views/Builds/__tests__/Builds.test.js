import Builds from '../Builds.vue';
import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import * as buildsApi from '@api/builds.js';

// Fixture
import { builds } from '@src/__fixtures__/builds.js';

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock('@api/request.js');

describe('Builds.vue', () => {
    let actions;
    let state;
    let store;
    let wrapper;

    beforeAll(() => {
        actions = { setBuilds: jest.fn() };
        state = { builds };
        store = new Vuex.Store({ actions, state });
        wrapper = shallowMount(Builds, { localVue, store });
    });

    describe('initial render', () => {
        test('should display grid view', () => {
            expect(wrapper.find('.grid-view').exists()).toBeTruthy();
        });
    });

    test('should filter results when search text is entered', () => {
        // expected result count before search
        expect(wrapper.findAll('.card')).toHaveLength(3);

        wrapper.find('input.search').setValue('Refresh');

        // expected result count after search
        expect(wrapper.findAll('.card')).toHaveLength(1);
    });

    test('should switch to list view when view toggle button is clicked from grid view', () => {
        wrapper.find('.views-toggle a').trigger('click');

        expect(wrapper.find('.list-view').exists()).toBeTruthy();
        expect(wrapper.find('.grid-view').exists()).toBeFalsy();
    });

    test('should switch to grid view when view toggle button is clicked from list view', () => {
        wrapper.setData({ activeView: 'list' });
        wrapper.find('.views-toggle a').trigger('click');

        expect(wrapper.find('.list-view').exists()).toBeFalsy();
        expect(wrapper.find('.grid-view').exists()).toBeTruthy();
    });

    test('should display the CreateBuildModal component when the + button is clicked', () => {
        wrapper.find('i.create-build').trigger('click');

        expect(wrapper.find('createbuildmodal-stub').exists()).toBeTruthy();
    });

    test('should remove the Build component from display when the selected build is clicked', () => {
        wrapper.setData({ activeView: 'list', selectedBuild: {} });

        const buildBox = wrapper.findAll('.build-box').at(0);

        buildBox.find('a').trigger('click');
        buildBox.find('a').trigger('click');

        expect(wrapper.find('build-stub').exists()).toBeFalsy();
    });

    test('should display the Build component when a build is clicked in list view', () => {
        wrapper.setData({ activeView: 'list' });
        wrapper.find('.build-box a').trigger('click');

        expect(wrapper.find('build-stub').exists()).toBeTruthy();
    });

    test('should call the getBuild API function when no build data exists in state', () => {
        const spy = jest.spyOn(buildsApi, 'getBuilds');

        state = { builds: [] };
        store = new Vuex.Store({ actions, state });
        wrapper = shallowMount(Builds, { localVue, store });

        expect(spy).toHaveBeenCalled();
    });
});
