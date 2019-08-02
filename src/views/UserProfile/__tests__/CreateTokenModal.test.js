import CreateTokenModal from '../CreateTokenModal.vue';
import { shallowMount } from '@vue/test-utils';
import * as users from '@api/users.js';

jest.mock('@src/api/request.js');

describe('CreateTokenModal.vue', () => {
    let methods;
    let wrapper;

    beforeEach(() => {
        methods = {};
        wrapper = shallowMount(CreateTokenModal, { methods });
    });

    // Helper functions
    const saveNewToken = () => {
        wrapper.find('.button.create').trigger('click');
    };

    const setTokenName = name => {
        wrapper.find('input').setValue(name);
    };

    describe('initial render', () => {
        test('should display an input field on initial render', () => {
            expect(wrapper.find('input').exists()).toBeTruthy();
        });

        test('should display a "Create Token" button', () => {
            expect(wrapper.find('.button').exists()).toBeTruthy();
        });
    });

    test('should close the modal when the close (x) icon is clicked', () => {
        methods = { closeModal: jest.fn() };
        wrapper = shallowMount(CreateTokenModal, { methods });

        wrapper.find('i.close').trigger('click');

        expect(methods.closeModal).toHaveBeenCalled();
    });

    test('should display error text if an emtpy token name is submitted', () => {
        wrapper.find('.button').trigger('click');

        expect(wrapper.text()).toContain('A token name is required.');
    });

    test('should not call createToken if an empty token name is submitted', () => {
        const spy = jest.spyOn(users, 'createToken');

        saveNewToken();

        expect(spy).not.toHaveBeenCalled();
    });

    test('should call the createToken method from the API', () => {
        const spy = jest.spyOn(users, 'createToken');

        setTokenName('Hello World');
        saveNewToken();

        expect(spy).toHaveBeenCalled();
    });

    test('should display the token value created', async () => {
        expect.assertions(1);

        const token = 'dustin';
        jest.spyOn(users, 'createToken').mockResolvedValue({
            data: { token },
        });

        setTokenName('apple');
        saveNewToken();

        await new Promise(resolve =>
            setTimeout(() => {
                expect(wrapper.find('textarea').element.value).toEqual(token);

                resolve();
            }, 10)
        );
    });

    test('should display a "Copy Token to Clipboard" button', async () => {
        expect.assertions(1);

        setTokenName('apple');
        saveNewToken();

        await new Promise(resolve =>
            setTimeout(() => {
                expect(wrapper.find('.copy-token').exists()).toBeTruthy();

                resolve();
            }, 10)
        );
    });

    test('should display an error message when a duplicate token name is submitted', async () => {
        expect.assertions(1);

        jest.spyOn(users, 'createToken').mockRejectedValueOnce({
            data: {
                error: 'name "test 1" is already in use',
            },
            status: 400,
        });

        setTokenName('test 1');
        saveNewToken();

        await new Promise(resolve =>
            setTimeout(() => {
                expect(wrapper.text()).toContain(
                    'You already have a token with that name.'
                );

                resolve();
            }, 10)
        );
    });
});
