import AuthenticationTokensTab from '../AuthenticationTokensTab.vue';
import Vuex from 'vuex';
import { createLocalVue, mount } from '@vue/test-utils';
import moment from 'moment';

// Fixture
import userAuthTokens from '@src/__fixtures__/userAuthTokens.js';

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock('@src/api/request.js');

describe('AuthenticationTokensTab.vue', () => {
    let actions;
    let state;
    let store;
    let mocks;
    let wrapper;

    beforeEach(() => {
        actions = { setUserAuthTokens: jest.fn() };
        state = { userAuthTokens: [] };
        store = new Vuex.Store({ actions, state });
        mocks = { $nextTick: jest.fn() };
        wrapper = mount(AuthenticationTokensTab, { localVue, mocks, store });
        wrapper.setData({ sortedTokens: userAuthTokens });
    });

    // Helper functions
    const clickCreateToken = () => {
        wrapper.find('a.create-token').trigger('click');
    };

    const clickDeleteToken = () => {
        wrapper.find('.delete-token').trigger('click');
    };

    describe('table row sorting', () => {
        let sortBySpy;

        beforeEach(() => {
            wrapper.setData({ sortedTokens: userAuthTokens });
            sortBySpy = jest.spyOn(wrapper.vm, 'sortBy');
        });

        const clickNameHeader = () => {
            wrapper.find('.table-header-filter.token-name').trigger('click');
        };

        const clickLastUsedHeader = () => {
            wrapper.find('.table-header-filter.last-used').trigger('click');
        };

        const clickCreatedHeader = () => {
            wrapper.find('.table-header-filter.created').trigger('click');
        };

        test('should call the sortBy method when the "Name" table header is clicked', () => {
            clickNameHeader();
            expect(sortBySpy).toHaveBeenCalled();
        });

        test('should call the sortBy method when the "Last Used" table header is clicked', () => {
            clickLastUsedHeader();
            expect(sortBySpy).toHaveBeenCalled();
        });

        test('should call the sortBy method when the "Created" table header is clicked', () => {
            clickCreatedHeader();
            expect(sortBySpy).toHaveBeenCalled();
        });

        test('should reverse sort the tokens by "name" when "Name" table header is clicked twice', async () => {
            // First click sorts table by token name alphabetically
            clickNameHeader();
            clickNameHeader();

            expect(
                wrapper
                    .findAll('.token .token-name')
                    .at(0)
                    .text()
            ).toEqual(userAuthTokens[3].name);
        });

        test('should sort the tokens by "last_used" when "Last Used" table header is clicked', () => {
            clickLastUsedHeader();

            const lastUsed = moment(userAuthTokens[3].last_used).fromNow();

            expect(
                wrapper
                    .findAll('.token .last-used')
                    .at(0)
                    .text()
            ).toEqual(lastUsed);
        });

        test('should sort the tokens by "created" when "Created" table header is clicked', () => {
            clickCreatedHeader();

            const created = moment(userAuthTokens[3].created).fromNow();

            expect(
                wrapper
                    .findAll('.token .created')
                    .at(0)
                    .text()
            ).toEqual(created);
        });
    });

    test('should not display modal on initial render', () => {
        expect(wrapper.find('.modal').exists()).toBeFalsy();
    });

    describe('when user has no tokens', () => {
        beforeEach(() => {
            wrapper.setData({ sortedTokens: [] });
        });

        test('should not display a search input field', () => {
            expect(wrapper.find('input.search').exists()).toBeFalsy();
        });

        test('should not display a table with tokens', () => {
            expect(wrapper.find('table').exists()).toBeFalsy();
        });

        test('should display "You do not have any tokens"', () => {
            expect(wrapper.html()).toContain('You do not have any tokens.');
        });

        test('should display a "Create a Token" button', () => {
            expect(wrapper.find('.button.create-token').exists()).toBeTruthy();
        });

        test('should open create token modal when "Create a Token" button is clicked', () => {
            clickCreateToken();
            expect(wrapper.find('.modal').exists()).toBeTruthy();
        });
    });

    test('should display a table with tokens', () => {
        expect(wrapper.find('table').exists()).toBeTruthy();
    });

    test('should display a search input field', () => {
        expect(wrapper.find('input.search').exists()).toBeTruthy();
    });


    test('should filter token results when text is entered in the search input field', () => {
        expect(wrapper.text()).toContain('Banana Token');

        wrapper.find('input.search').setValue('apple');

        expect(wrapper.text()).not.toContain('Banana Token');
    });

    test('should display a "Create a Token" button', () => {
        expect(wrapper.find('.button.create-token').exists()).toBeTruthy();
    });

    test('should open create token modal when "Create a Token" button is clicked', () => {
        clickCreateToken();
        expect(wrapper.find('.modal').exists()).toBeTruthy();
    });

    test('should display spinner if tokens are still being retrieved from the API', () => {
        wrapper.setData({ sortedTokens: [], noTokens: false });

        expect(wrapper.find('.spinner').exists()).toBeTruthy();
    });

    test('should display a confirmation modal when user attempts to delete a token', () => {
        clickDeleteToken();
        expect(wrapper.find('.base-modal').exists()).toBeTruthy();
    });

    test('should display an input field after user clicks "Create a Token" button', () => {
        clickCreateToken();
        expect(wrapper.find('input').exists()).toBeTruthy();
    });

    test('should display tokens added by the user', () => {
        expect(wrapper.html()).toContain(userAuthTokens[0].name);
    });

    test('should call the closeModal method when modal background is clicked', () => {
        const spy = jest.spyOn(wrapper.vm, 'closeModal');

        clickDeleteToken();
        wrapper.find('.modal-background').trigger('click');

        expect(spy).toHaveBeenCalled();
    });

    test('should call the removeToken method when "Delete Token" button is clicked', () => {
        const spy = jest.spyOn(wrapper.vm, 'removeToken');

        clickDeleteToken();
        wrapper.find('a.confirm').trigger('click');

        expect(spy).toHaveBeenCalled();
    });
});
