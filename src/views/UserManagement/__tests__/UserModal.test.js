import CreateUserModal from '../CreateUserModal.vue';
import Vuex from 'vuex';
import { createLocalVue, mount } from '@vue/test-utils';

// Fixture
import builds from '@src/__fixtures__/builds.js';
import organizations from '@src/__fixtures__/organizations.js';
import users from '@src/__fixtures__/users.js';

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock('@api/request.js');

describe('CreateUserModal.vue', () => {
    let propsData;
    let state;
    let store;
    let user;
    let wrapper;

    beforeEach(() => {
        state = { builds, organizations };
        user = users[0];
        propsData = { editingUser: user };
        store = new Vuex.Store({ state });
        wrapper = mount(CreateUserModal, { localVue, propsData, store });
    });

    describe('closing the modal', () => {
        let spy;

        beforeEach(() => {
            spy = jest.spyOn(wrapper.vm, 'closeModal');
        });

        test('should close the modal when modal background is clicked', () => {
            wrapper.find('.modal-background').trigger('click');

            expect(spy).toHaveBeenCalled();
        });

        test('should close the modal when modal close button is clicked', () => {
            wrapper.find('button.delete').trigger('click');

            expect(spy).toHaveBeenCalled();
        });
    });
});
