<template>
    <div class="user-authentication-tokens">
        <Spinner v-if="!filteredTokens.length && !noTokens && !searchText" />
        <div class="header" v-if="filteredTokens.length">
            <div class="control has-icons-left">
                <input
                    type="text"
                    class="input search"
                    placeholder="Search Tokens"
                    v-model="searchText"
                />
                <span class="icon is-small is-left">
                    <i class="fas fa-search"></i>
                </span>
            </div>
            <a
                class="button create-token is-info is-outlined"
                @click="creatingToken = true"
            >
                Create New Token
            </a>
        </div>
        <table
            class="table is-hoverable is-fullwidth"
            style="border-radius: 4px;"
            v-if="filteredTokens.length && filteredTokens.length >= 1"
        >
            <thead>
                <th></th>
                <th>
                    <a
                        class="table-header-filter token-name"
                        :class="{
                            'has-text-white': sortFilter === 'name',
                        }"
                        @click="sortBy('name')"
                    >
                        Token Name
                        <i
                            class="fas fa-angle-down"
                            v-if="sortFilter === 'name' && !reversedSort"
                            style="margin-left: 10px;"
                        ></i>
                        <i
                            class="fas fa-angle-up"
                            v-else-if="sortFilter === 'name' && reversedSort"
                            style="margin-left: 10px;"
                        ></i>
                    </a>
                </th>
                <th>
                    <a
                        class="table-header-filter last-used"
                        :class="{
                            'has-text-white': sortFilter === 'last_used',
                        }"
                        @click="sortBy('last_used')"
                    >
                        Last Used
                        <i
                            class="fas fa-angle-down"
                            v-if="sortFilter === 'last_used' && !reversedSort"
                            style="margin-left: 10px;"
                        ></i>
                        <i
                            class="fas fa-angle-up"
                            v-else-if="
                                sortFilter === 'last_used' && reversedSort
                            "
                            style="margin-left: 10px;"
                        ></i>
                    </a>
                </th>
                <th>
                    <a
                        class="table-header-filter created"
                        :class="{
                            'has-text-white': sortFilter === 'created',
                        }"
                        @click="sortBy('created')"
                    >
                        Created
                        <i
                            class="fas fa-angle-down"
                            v-if="sortFilter === 'created' && !reversedSort"
                            style="margin-left: 10px;"
                        ></i>
                        <i
                            class="fas fa-angle-up"
                            v-else-if="sortFilter === 'created' && reversedSort"
                            style="margin-left: 10px;"
                        ></i>
                    </a>
                </th>
                <th></th>
            </thead>
            <tfoot v-if="filteredTokens.length && filteredTokens.length > 10">
                <th></th>
                <th>Name</th>
                <th>Last Used</th>
                <th>Created</th>
                <th></th>
            </tfoot>
            <tbody>
                <tr
                    class="token"
                    v-for="token in filteredTokens"
                    :key="token.name"
                >
                    <td>
                        <i class="fas fa-key has-text-success"></i>
                    </td>
                    <td class="token-name">
                        {{ token.name }}
                    </td>
                    <td class="last-used" v-if="token.last_used">{{
                        getDate(token.last_used)
                    }}</td>
                    <td class="last-used" v-else>Never</td>
                    <td class="created">{{ getDate(token.created) }}</td>
                    <td>
                        <span
                            class="icon delete-token"
                            @click="openModal(token.name)"
                        >
                            <i class="fas fa-trash-alt"></i>
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
        <div
            class="no-search-results"
            v-else-if="!filteredTokens.length && searchText"
        >
            <p class="title is-4 has-text-white has-text-centered">
                No Results Found.
            </p>
        </div>
        <div
            class="empty-state"
            v-if="!filteredTokens.length && noTokens && !creatingToken"
        >
            <p class="empty-state-heading is-marginless">
                You do not have any tokens.
            </p>
            <a
                class="button create-token is-info"
                @click="creatingToken = true"
            >
                Create a Token
            </a>
            <img src="../../assets/authentication.svg" width="500" />
        </div>
        <BaseModal v-if="deletingToken">
            <template v-slot:icon>
                <i class="far fa-4x fa-times-circle has-text-danger"></i>
            </template>
            <template v-slot:title>
                <h1 class="title">Delete Token?</h1>
            </template>
            <template v-slot:body>
                <p class="subtitle">
                    Are you sure you want to delete
                    <strong class="name">{{ tokenName }}</strong
                    >?
                </p>
            </template>
            <template v-slot:footer>
                <a
                    class="button confirm is-success is-fullwidth"
                    @click="removeToken(tokenName)"
                >
                    Delete Token
                    <i class="fas fa-lg fa-long-arrow-alt-right"></i>
                </a>
            </template>
        </BaseModal>
        <BaseModal v-else-if="deleteSuccess">
            <template v-slot:icon>
                <i class="far fa-4x fa-check-circle has-text-success"></i>
            </template>
            <template v-slot:title>
                <h1 class="title">Success!</h1>
            </template>
            <template v-slot:body>
                <p class="subtitle" v-if="deleteSuccess">
                    <strong class="has-text-white">{{ tokenName }}</strong>
                    has been deleted.
                </p>
            </template>
            <template v-slot:footer>
                <a
                    class="button close is-success is-fullwidth"
                    @click="closeModal()"
                >
                    Close
                    <i class="fas fa-lg fa-long-arrow-alt-right"></i>
                </a>
            </template>
        </BaseModal>
        <CreateTokenModal v-else-if="creatingToken" />
    </div>
</template>

<script>
import moment from 'moment';
import search from 'fuzzysearch';
import orderBy from 'lodash/orderBy';
import Spinner from '@src/views/components/Spinner.vue';
import BaseModal from '@src/views/components/BaseModal.vue';
import CreateTokenModal from './CreateTokenModal.vue';
import { EventBus } from '@src/eventBus.js';
import { createToken, deleteToken, getTokens } from '@api/users.js';
import { mapActions, mapState } from 'vuex';

export default {
    components: {
        BaseModal,
        CreateTokenModal,
        Spinner,
    },
    data() {
        return {
            createSuccess: false,
            creatingToken: false,
            deleteSuccess: false,
            deletingToken: false,
            duplicateTokenNameError: false,
            isLoading: false,
            noTokens: false,
            reversedSort: false,
            searchText: '',
            sortFilter: '',
            sortedTokens: [],
            tokenName: '',
        };
    },
    methods: {
        ...mapActions(['setUserAuthTokens']),
        closeModal() {
            this.creatingToken = false;
            this.deletingToken = false;
            this.deleteSuccess = false;
            this.tokenName = '';
        },
        getDate(createdDate) {
            return moment(createdDate).fromNow();
        },
        openModal(tokenName) {
            this.deletingToken = true;
            this.tokenName = tokenName;
        },
        removeToken(name) {
            deleteToken(name).then(() => {
                this.deletingToken = false;
                this.deleteSuccess = true;

                this.setTokens();
            });
        },
        save() {
            const tokenName = this.tokenName;
            this.isLoading = true;

            if (tokenName) {
                createToken(tokenName)
                    .then(response => {
                        this.creatingToken = false;
                        this.createSuccess = true;
                        this.isLoading = false;

                        if (this.sortedTokens.length) {
                            this.sortedTokens.unshift(response.data);
                        } else {
                            this.sortedTokens.push(response.data);
                        }

                        setTimeout(() => {
                            this.createSuccess = false;
                            this.tokenName = '';
                        }, 3000);
                    })
                    .catch(error => {
                        if (error.status === 400) {
                            const errorData = error.data;
                            if (errorData && errorData.error) {
                                if (
                                    errorData.error.includes(
                                        `name "${tokenName}" is already in use`
                                    )
                                ) {
                                    this.duplicateTokenNameError = true;
                                    this.isLoading = false;
                                    this.creatingToken = false;

                                    setTimeout(() => {
                                        this.duplicateTokenNameError = false;
                                        this.tokenName = '';
                                    }, 3000);
                                }
                            }
                        }
                    });
            } else {
                this.isLoading = false;
            }
        },
        setTokens() {
            this.sortedTokens = [];

            getTokens().then(response => {
                const tokens = response.data;

                if (tokens.length) {
                    this.sortedTokens = tokens;
                    this.setUserAuthTokens(tokens);
                } else {
                    this.noTokens = true;
                }
            });
        },
        sortBy(field) {
            let tokens = this.sortedTokens;

            if (this.sortFilter !== field) {
                if (field === 'name') {
                    this.sortedTokens = orderBy(
                        tokens,
                        [token => token.name],
                        ['asc']
                    );
                } else if (field === 'last_used') {
                    this.sortedTokens = orderBy(
                        tokens,
                        [token => token.last_used],
                        ['desc']
                    );
                } else if (field === 'created') {
                    this.sortedTokens = orderBy(
                        tokens,
                        [token => token.created],
                        ['desc']
                    );
                }

                this.sortFilter = field;
            } else {
                tokens.reverse();
                this.reversedSort = !this.reversedSort;
                this.sortedTokens = tokens;
            }
        },
    },
    computed: {
        ...mapState(['userAuthTokens']),
        filteredTokens() {
            const searchText = this.searchText.toLowerCase();
            let tokens = this.sortedTokens;

            if (searchText) {
                return tokens.reduce((acc, token) => {
                    const name = token.name.toLowerCase();

                    if (search(searchText, name)) {
                        acc.push(token);
                    }

                    return acc;
                }, []);
            }

            return tokens;
        },
    },
    mounted() {
        EventBus.$on('closeModal:baseModal', () => {
            this.closeModal();
        });

        EventBus.$on('close-modal', () => {
            this.closeModal();
        });

        EventBus.$on('create-token', token => {
            if (this.sortedTokens.length) {
                this.sortedTokens.unshift(token);
            } else {
                this.sortedTokens.push(token);
            }
        });
    },
    created() {
        this.setTokens();
    },
};
</script>
