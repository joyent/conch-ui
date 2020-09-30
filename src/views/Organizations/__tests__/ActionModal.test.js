import ActionModal from '../ActionModal.vue';
import { shallowMount } from '@vue/test-utils';
import * as buildsApi from '@api/builds.js';
import * as organizationsApi from '@api/organizations.js';

// Fixture
import { builds } from '@src/__fixtures__/builds.js';
import users from '@src/__fixtures__/users.js';

jest.mock('@api/request.js');

describe('ActionModal.vue', () => {
    let propsData;
    let wrapper;

    beforeEach(() => {
        propsData = {
            action: 'add',
            availableData: users,
            itemType: 'members',
            organizationId: 'asdf3ba1-8jks-642f-3432-928av8gg5cd9',
            unavailableData: [],
        };

        wrapper = shallowMount(ActionModal, { propsData });
    });

    describe('closing the modal', () => {
        test('should close the modal when modal background is clicked', () => {
            wrapper.find('.modal-background').trigger('click');

            expect(wrapper.find('.modal.is-active').exists()).toBeFalsy();
        });

        test('should close the modal when the X button is clicked', () => {
            wrapper.find('i.close').trigger('click');

            expect(wrapper.find('.modal.is-active').exists()).toBeFalsy();
        });

        test('should close the modal when the Cancel button is clicked', () => {
            wrapper.find('.button.cancel').trigger('click');

            expect(wrapper.find('.modal.is-active').exists()).toBeFalsy();
        });
    });

    describe('intial render', () => {
        test('should not display any select dropdowns', () => {
            expect(wrapper.find('select').exists()).toBeFalsy();
        });

        test('should not display any checkmarks', () => {
            expect(wrapper.find('i.item-added').exists()).toBeFalsy();
        });

        test('should not display any X buttons', () => {
            expect(wrapper.find('i.remove-item').exists()).toBeFalsy();
        });

        test('should display the Add button as disabled', () => {
            expect(
                wrapper.find('.button.confirm').attributes('disabled')
            ).toBeTruthy();
        });
    });

    test('should filter results when search text is entered', () => {
        // expected result count before search
        expect(wrapper.findAll('tr.row')).toHaveLength(2);

        wrapper.find('input.search').setValue('Another');

        // expected result count after search
        expect(wrapper.findAll('tr.row')).toHaveLength(1);
    });

    test("should update a user's role when a non-default role is selected", () => {
        wrapper.find('i.add-item').trigger('click');

        const options = wrapper.find('select').findAll('option');
        options.at(0).setSelected();

        expect(wrapper.vm.modifiedData[0].role).toEqual('admin');
    });

    describe('row action buttons', () => {
        let row;

        beforeEach(() => {
            row = wrapper.find('.row');

            row.find('i.add-item').trigger('click');
        });

        // Helper function
        const mouseoverActionButton = () => {
            row.find('.action i').trigger('mouseover');
        };

        test('should display a select dropdown in the row when a + button is clicked', () => {
            expect(row.find('select').exists()).toBeTruthy();
        });

        test('should display a checkmark where the + button was when it is clicked', () => {
            expect(row.find('i.item-added').exists()).toBeTruthy();
        });

        test('should display a X button when a checkmark is hovered', () => {
            mouseoverActionButton();

            expect(row.find('i.remove-item').exists()).toBeTruthy();
        });

        test('should display a + button again when a X button is clicked', () => {
            mouseoverActionButton();
            row.find('i.remove-item').trigger('click');

            expect(row.find('i.add-item').exists()).toBeTruthy();
        });

        test('should display a checkmark again when a X button is no longer hovered', () => {
            mouseoverActionButton();
            row.find('.action i').trigger('mouseleave');

            expect(row.find('i.remove-item').exists()).toBeFalsy();
            expect(row.find('i.item-added').exists()).toBeTruthy();
        });
    });

    test('should remove the disabled attribute on the confirm button when item is added', () => {
        wrapper.find('i.add-item').trigger('click');

        expect(
            wrapper.find('.button.confirm').attributes('disabled')
        ).toBeFalsy();
    });

    describe('save changes', () => {
        describe('users', () => {
            test('adding users calls the addUserToOrganization API function', () => {
                expect.assertions(1);

                const spy = jest.spyOn(
                    organizationsApi,
                    'addUserToOrganization'
                );

                wrapper.find('i.add-item').trigger('click');
                wrapper.find('a.button.confirm').trigger('click');

                expect(spy).toHaveBeenCalled();
            });

            test('removing users calls the removeUserFromOrganization API function', () => {
                expect.assertions(1);

                const organizationId = wrapper.vm.organizationId;
                const spy = jest.spyOn(
                    organizationsApi,
                    'removeUserFromOrganization'
                );

                propsData.action = 'remove';
                propsData.availableData = [];
                propsData.unavailableData = users;

                wrapper = shallowMount(ActionModal, { propsData });

                wrapper.find('i.remove-item').trigger('click');
                wrapper.find('a.button.confirm').trigger('click');

                const id = wrapper.vm.modifiedData[0].id;

                expect(spy).toHaveBeenCalledWith(organizationId, id);
            });
        });

        describe('builds', () => {
            test('adding builds calls the addOrganizationToBuild API function', () => {
                expect.assertions(1);

                const spy = jest.spyOn(buildsApi, 'addOrganizationToBuild');

                propsData = {
                    action: 'add',
                    availableData: builds,
                    itemType: 'builds',
                    organizationId: 'asdf3ba1-8jks-642f-3432-928av8gg5cd9',
                    unavailableData: [],
                };

                wrapper = shallowMount(ActionModal, { propsData });

                const organizationId = wrapper.vm.organizationId;

                wrapper.find('i.add-item').trigger('click');

                const buildId = wrapper.vm.modifiedData[0].id;
                const role = wrapper.vm.modifiedData[0].role;

                wrapper.find('a.button.confirm').trigger('click');

                expect(spy).toHaveBeenCalledWith(buildId, organizationId, role);
            });

            test('removing users calls the removeOrganizationFromBuild API function', () => {
                expect.assertions(1);

                const spy = jest.spyOn(
                    buildsApi,
                    'removeOrganizationFromBuild'
                );

                propsData = {
                    action: 'remove',
                    availableData: [],
                    itemType: 'builds',
                    organizationId: 'asdf3ba1-8jks-642f-3432-928av8gg5cd9',
                    unavailableData: builds,
                };

                wrapper = shallowMount(ActionModal, { propsData });

                const organizationId = wrapper.vm.organizationId;

                wrapper.find('i.remove-item').trigger('click');

                const buildId = wrapper.vm.modifiedData[0].id;

                wrapper.find('a.button.confirm').trigger('click');

                expect(spy).toHaveBeenCalledWith(buildId, organizationId);
            });
        });
    });
});
