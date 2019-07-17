<template>
    <div class="user-authentication-tokens">
        <div class="header">
            <span class="subtitle">
                Authentication Tokens
            </span>
            <a
                class="button add is-outlined is-success"
                @click="nameNewToken()"
                v-if="!creatingToken"
                :disabled="createSuccess"
            >
                Create Token
            </a>
            <a
                class="button cancel is-outlined is-danger"
                @click="cancelNewToken()"
                v-else-if="creatingToken && !createSuccess"
            >
                Cancel
            </a>
        </div>
        <transition name="fade">
            <article
                class="message success is-success"
                v-if="createSuccess && !creatingToken"
                style="border-radius: 5px; margin-bottom: 20px;"
            >
                <div
                    class="message-header"
                    style="border-radius: 5px; padding: 8px;"
                >
                    <p>
                        <i class="fas fa-check-circle"></i>
                        {{ tokenName }} has been succesfully created.
                    </p>
                    <button
                        class="delete"
                        aria-label="delete"
                        @click="createSuccess = false"
                    ></button>
                </div>
            </article>
            <article
                class="message duplicate-name-error is-danger"
                v-if="duplicateTokenNameError && !creatingToken"
                style="border-radius: 5px; margin-bottom: 20px;"
            >
                <div
                    class="message-header"
                    style="border-radius: 5px; padding: 8px;"
                >
                    <p>
                        <i class="fas fa-check-circle"></i>
                        A token with the name {{ tokenName }} already exists.
                    </p>
                    <button
                        class="delete"
                        aria-label="delete"
                        @click="duplicateTokenNameError = false"
                    ></button>
                </div>
            </article>
        </transition>
        <div class="card" style="border-radius: 5px;">
            <div class="card-content">
                <div class="content">
                    <Spinner v-if="!sortedTokens.length && !noTokens" />
                    <table
                        class="table is-fullwidth"
                        style="border-radius: 4px;"
                        v-else-if="sortedTokens.length || creatingToken"
                    >
                        <thead>
                            <th></th>
                            <th>
                                <a
                                    class="table-header-filter token-name"
                                    :class="{ 'has-text-white': sortFilter === 'name' }"
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
                                    :class="{ 'has-text-white': sortFilter === 'last_used' }"
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
                                        v-else-if="sortFilter === 'last_used' && reversedSort"
                                        style="margin-left: 10px;"
                                    ></i>
                                </a>
                            </th>
                            <th>
                                <a
                                    class="table-header-filter created"
                                    :class="{ 'has-text-white': sortFilter === 'created' }"
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
                        <tfoot>
                            <th></th>
                            <th>Name</th>
                            <th>Last Used</th>
                            <th>Created</th>
                            <th></th>
                        </tfoot>
                        <tbody>
                            <tr v-if="creatingToken" class="token create">
                                <td colspan="6">
                                    <div class="field has-addons">
                                        <i
                                            class="fas fa-key has-text-success"
                                            style="display: flex;align-items: center;margin-right: 14px;"
                                        ></i>
                                        <div class="control is-expanded">
                                            <input
                                                class="input"
                                                type="text"
                                                placeholder="Token name"
                                                v-model="tokenName"
                                                ref="newToken"
                                                @keyup.enter="save()"
                                            >
                                        </div>
                                        <div class="control">
                                            <a
                                                class="button create is-success"
                                                :class="{ 'is-loading': isLoading }"
                                                @click="save()"
                                            >
                                                <span>
                                                    Create Token
                                                </span>
                                            </a>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr
                                class="token"
                                v-for="token in sortedTokens"
                                :key="token.name"
                            >
                                <td>
                                    <i
                                        class="fas fa-key has-text-success"
                                    ></i>
                                </td>
                                <td class="token-name">
                                    {{ token.name }}
                                </td>
                                <td class="last-used" v-if="token.last_used">{{ getDate(token.last_used) }}</td>
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
                    <div v-else-if="noTokens">
                        <p
                            class="subtitle has-text-white has-text-centered"
                            style="padding: 20px; margin-bottom: 0;"
                        >
                            You do not have any tokens.
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <transition name="fade">
            <BaseModal v-if="deletingToken">
                <template v-slot:icon>
                    <i class="far fa-4x fa-times-circle has-text-danger"></i>
                </template>
                <template v-slot:title>
                    <h1 class="title">Delete Token?</h1>
                </template>
                <template v-slot:body>
                    <p class="subtitle">
                        Are you sure you want to delete <strong class="name">{{ tokenName }}</strong>?
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
                        <strong class="has-text-white">{{ tokenName }}</strong> has been deleted.
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
        </transition>
    </div>
</template>

<script>
import moment from 'moment';
import orderBy from 'lodash/orderBy';
import Spinner from '@src/views/components/Spinner.vue';
import BaseModal from '@src/views/components/BaseModal.vue';
import { EventBus } from '@src/eventBus.js';
import { createToken, deleteToken, getTokens } from '@api/users.js';
import { mapActions, mapState } from 'vuex';

export default {
    components: {
        BaseModal,
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
            sortFilter: '',
            sortedTokens: [],
            tokenName: '',
        };
    },
    methods: {
        ...mapActions([
            'setUserAuthTokens',
        ]),
        cancelNewToken() {
            this.creatingToken = false;
            this.tokenName = '';
        },
        closeModal() {
            this.deletingToken = false;
            this.deleteSuccess = false;
            this.tokenName = '';
        },
        getDate(createdDate) {
            return moment(createdDate).fromNow();
        },
        nameNewToken() {
            this.tokenName = '';
            this.creatingToken = true;
            this.$nextTick(() => this.$refs.newToken.focus())
        },
        openModal(tokenName) {
            this.deletingToken = true;
            this.tokenName = tokenName;
        },
        removeToken(name) {
            deleteToken(name)
                .then(() => {
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
                        }, 2000);
                    })
                    .catch(error => {
                        if (error.status === 400) {
                            const errorData = error.data;
                            if (errorData && errorData.error) {
                                if (errorData.error.includes(`name "${tokenName}" is already in use`)) {
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
            getTokens()
                .then(response => {
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
                    this.sortedTokens = orderBy(tokens, [token => token.name], ['asc']);
                } else if (field === 'last_used') {
                    this.sortedTokens = orderBy(tokens, [token => token.last_used], ['desc']);
                } else if (field === 'created') {
                    this.sortedTokens = orderBy(tokens, [token => token.created], ['desc']);
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
        ...mapState([
            'userAuthTokens',
        ]),
    },
    mounted() {
        EventBus.$on('closeModal:baseModal', () => {
            this.closeModal();
        });
    },
    created() {
        this.setTokens();
    },
};
</script>
