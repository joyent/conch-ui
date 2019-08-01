import CreateTokenModal from '../CreateTokenModal.vue';
import { shallowMount } from '@vue/test-utils';
import * as users from '@api/users.js';

describe('CreateTokenModal.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(CreateTokenModal);
    });

    // Helper functions
    const clickCreateToken = () => {
        wrapper.find('a.create-token').trigger('click');
    };

    const saveNewToken = () => {
        wrapper.find('a.create').trigger('click');
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

    test('should display error text if an emtpy token name is submitted', () => {
        wrapper.find('.button').trigger('click');

        expect(wrapper.text()).toContain('A token name is required.');
    });

    // test.skip('should call createToken when valid token name is submitted', () => {
    //     const spy = jest.spyOn(users, 'createToken');

    //     clickCreateToken();
    //     setTokenName('abcdefg');
    //     saveNewToken();

    //     expect(spy).toHaveBeenCalled();
    // });

    // test.skip('should not call createToken if an empty token name is submitted', () => {
    //     const spy = jest.spyOn(users, 'createToken');

    //     clickCreateToken();
    //     setTokenName('');
    //     saveNewToken();

    //     expect(spy).not.toHaveBeenCalled();
    // });

    // test.skip('should display an error message when a duplicate token name is submitted', async () => {
    //     jest.spyOn(users, 'createToken').mockRejectedValueOnce({
    //         data: {
    //             error: 'name "test 1" is already in use',
    //         },
    //         status: 400,
    //     });

    //     clickCreateToken();
    //     setTokenName('test 1');
    //     saveNewToken();

    //     await new Promise(resolve =>
    //         setTimeout(() => {
    //             expect(
    //                 wrapper.find('.duplicate-name-error').exists()
    //             ).toBeTruthy();
    //             resolve();
    //         }, 10)
    //     );
    // });

    // test.skip('should display a success message when a token is successfully created', async () => {
    //     clickCreateToken();
    //     setTokenName('test 1');
    //     saveNewToken();

    //     await new Promise(resolve =>
    //         setTimeout(() => {
    //             expect(wrapper.find('.message.success').exists()).toBeTruthy();
    //             resolve();
    //         }, 10)
    //     );
    // });
});
