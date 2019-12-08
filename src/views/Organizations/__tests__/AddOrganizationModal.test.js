import AddOrganizationModal from '../AddOrganizationModal.vue';
import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import buildsApi from '@api/builds.js';
import organizationsApi from '@api/organizations.js';

// Fixtures
import { builds } from '@src/__fixtures__/builds.js';
import users from '@src/__fixtures__/users.js';

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock('@api/request.js');

describe('AddOrganizationModal.vue', () => {
    let actions;
    let state;
    let store;
    let wrapper;

    beforeEach(() => {
        actions = {
            setBuilds: jest.fn(),
            setUsers: jest.fn(),
        };
        state = { builds, users };
        store = new Vuex.Store({ actions, state });
        wrapper = shallowMount(AddOrganizationModal, { localVue, store });
    });

    test('should display step 1 on initial render', () => {
        expect(wrapper.vm.activeStep).toEqual(1);
    });

    describe('close modal', () => {
        test('should close the modal when modal background is clicked', () => {
            wrapper.find('.modal-background').trigger('click');

            expect(wrapper.find('.modal.is-active').exists()).toBeFalsy();
        });

        test('should close the modal when X button is clicked', () => {
            const modalHeading = wrapper.find('.modal-heading');
            modalHeading.find('i.close').trigger('click');

            expect(wrapper.find('.modal.is-active').exists()).toBeFalsy();
        });
    });

    describe('step 1 - organization details', () => {
        test('should not advance to step 2 until the organization is given a name', () => {
            wrapper.find('a.next').trigger('click');

            expect(wrapper.vm.activeStep).toEqual(1);
        });

        test('should display an error message when organization name is not entered', () => {
            wrapper.find('a.next').trigger('click');

            expect(wrapper.text()).toContain('This field is required');
        });

        test('should advance to step 2 when an organization name is entered', () => {
            wrapper.find('input.name').setValue('Engineering');
            wrapper.find('a.next').trigger('click');

            expect(wrapper.vm.activeStep).toEqual(2);
        });

        test('should activate step when step indicator dot is clicked if step requirements are met', () => {
            wrapper.find('input.name').setValue('Engineering');
            wrapper
                .findAll('.dot')
                .at(1)
                .trigger('click');

            expect(wrapper.vm.activeStep).toEqual(2);
        });
    });

    describe('step 2 add users to organization', () => {
        beforeEach(() => {
            wrapper.setData({ activeStep: 2 });
        });

        test('should not display any select dropdowns until a user is selected', () => {
            expect(wrapper.find('select').exists()).toBeFalsy();
        });

        test('should not display any checkmarks until a user is selected', () => {
            expect(wrapper.find('i.item-added').exists()).toBeFalsy();
        });

        test('should not display any X buttons until a checkmark is hovered', () => {
            expect(wrapper.find('i.remove-item').exists()).toBeFalsy();
        });

        test('should go back to the previous step when the "Previous" button is clicked', () => {
            wrapper.find('a.previous').trigger('click');

            expect(wrapper.vm.activeStep).toEqual(1);
        });

        test('should not advance to step 3 until at least one selected user has admin privileges', () => {
            wrapper.find('a.next').trigger('click');

            expect(wrapper.vm.activeStep).toEqual(2);
        });

        test('should advance to step 3 when at least one selected user has admin privileges', () => {
            wrapper.find('i.add-item').trigger('click');

            const options = wrapper.find('select').findAll('option');
            options.at(0).setSelected();

            wrapper.find('a.next').trigger('click');

            expect(wrapper.vm.activeStep).toEqual(3);
        });

        test('should display a select dropdown when a user is selected', () => {
            wrapper.find('i.add-item').trigger('click');

            expect(wrapper.find('select').exists()).toBeTruthy();
        });

        test('should filter results when search text is entered', () => {
            // expected result count before search
            expect(wrapper.findAll('tr.item')).toHaveLength(2);

            wrapper.find('input.search').setValue('Another');

            // expected result count after search
            expect(wrapper.findAll('tr.item')).toHaveLength(1);
        });

        test('should not activate step when step dot is clicked if requirement is not met', () => {
            wrapper
                .findAll('.dot')
                .at(2)
                .trigger('click');

            expect(wrapper.vm.activeStep).toEqual(2);
        });

        test('should activate step when step dot is clicked if step requirement is met', () => {
            wrapper.find('i.add-item').trigger('click');
            wrapper
                .find('select')
                .findAll('option')
                .at(0)
                .setSelected();
            wrapper
                .findAll('.dot')
                .at(2)
                .trigger('click');

            expect(wrapper.vm.activeStep).toEqual(3);
        });
    });

    describe('step 3 - add organization to builds', () => {
        beforeEach(() => {
            wrapper.setData({ activeStep: 3 });
        });

        test('should not display any select dropdowns until a user is selected', () => {
            expect(wrapper.find('select').exists()).toBeFalsy();
        });

        test('should not display any checkmarks until a user is selected', () => {
            expect(wrapper.find('i.item-added').exists()).toBeFalsy();
        });

        test('should advance to step 4 when the "Next" button is clicked', () => {
            wrapper.find('a.next').trigger('click');

            expect(wrapper.vm.activeStep).toEqual(4);
        });

        test('should display a select dropdown when a build is selected', () => {
            wrapper.find('i.add-item').trigger('click');

            expect(wrapper.find('select').exists()).toBeTruthy();
        });

        test('should filter results when search text is entered', () => {
            // expected result count before search
            expect(wrapper.findAll('tr.item')).toHaveLength(3);

            wrapper.find('input.search').setValue('Refresh');

            // expected result count after search
            expect(wrapper.findAll('tr.item')).toHaveLength(1);
        });
    });

    describe('step 4 - review details and create organization', () => {
        beforeEach(() => {
            // step 1
            wrapper.find('input.name').setValue('Engineering');
            wrapper.find('a.next').trigger('click');

            // step 2
            wrapper.findAll('i.add-item').at(0).trigger('click');
            wrapper
                .find('select')
                .findAll('option')
                .at(0)
                .setSelected();
            wrapper.findAll('i.add-item').at(0).trigger('click');

            // step 3
            wrapper.find('a.next').trigger('click');
            wrapper.find('i.add-item').trigger('click');

            // step 4
            wrapper.find('a.next').trigger('click');
        });
    });
});
