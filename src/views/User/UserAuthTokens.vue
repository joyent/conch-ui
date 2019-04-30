<template>
    <div class="tokens">
        <div class="header">
            <span class="subtitle">
                Authentication Tokens
            </span>
            <button
                class="button add is-outlined is-success"
                @click="nameNewToken()"
                v-if="!creatingToken"
            >
                Create Token
            </button>
            <button
                class="button cancel is-outlined is-danger"
                :disabled="creatingToken && createSuccess"
                @click="cancelNewToken()"
                v-else
            >
                Cancel
            </button>
        </div>
        <div class="card" style="border-radius: 5px;">
            <div class="card-content">
                <div class="content">
                    <table
                        class="table is-fullwidth"
                        style="border-radius: 4px;"
                        v-if="tokens.length || creatingToken"
                    >
                        <thead>
                            <th></th>
                            <th>Name</th>
                            <th>Last Used</th>
                            <th>Created</th>
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
                                <td colspan="6" :class="{ 'has-success-background': createSuccess}">
                                    <div class="field has-addons" v-if="!createSuccess">
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
                                            >
                                        </div>
                                        <div class="control">
                                            <a
                                                class="button is-success"
                                                :class="{ 'is-loading': isLoading }"
                                                @click="save()"
                                            >
                                                <span v-if="!createSuccess">
                                                    Create Token
                                                </span>
                                            </a>
                                        </div>
                                    </div>
                                    <p
                                        class="has-text-centered"
                                        v-else
                                    >
                                        <strong class="has-text-white">{{ tokenName }}</strong> has been successfully created!
                                    </p>
                                </td>
                            </tr>
                            <tr
                                class="token"
                                v-for="token in tokens"
                                :key="token.id"
                            >
                                <td>
                                    <i
                                        class="fas fa-key has-text-success"
                                    ></i>
                                </td>
                                <td>
                                    {{ token.name }}
                                </td>
                                <td v-if="token.last_used">{{ getDate(token.last_used) }}</td>
                                <td v-else>Never</td>
                                <td>{{ getDate(token.created) }}</td>
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
                    <div v-else>
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
            <ConfirmationModal v-if="deletingToken">
                <template v-slot:icon>
                    <i class="far fa-4x fa-times-circle has-text-danger"></i>
                </template>
                <template v-slot:title>
                    <h1 class="title">Delete Token?</h1>
                </template>
                <template v-slot:subtitle>
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
            </ConfirmationModal>
            <ResultModal v-else-if="deleteSuccess">
                <template v-slot:icon>
                    <i class="far fa-4x fa-check-circle has-text-success"></i>
                </template>
                <template v-slot:title>Success!</template>
                <template v-slot:subtitle>
                    <p class="subtitle" v-if="createSuccess">
                        <strong class="has-text-white">{{ tokenName }}</strong> has been created.
                    </p>
                    <p class="subtitle" v-else-if="deleteSuccess">
                        <strong class="has-text-white">{{ tokenName }}</strong> has been deleted.
                    </p>
                </template>
            </ResultModal>
        </transition>
    </div>
</template>

<script>
import moment from 'moment';
import ResultModal from './ResultModal.vue';
import ConfirmationModal from '@src/views/components/ConfirmationModal.vue';
import { createToken, deleteToken, getTokens } from '@api/users.js';
import { mapActions, mapState } from 'vuex';

export default {
    components: {
        ConfirmationModal,
        ResultModal,
    },
    data() {
        return {
            createSuccess: false,
            creatingToken: false,
            deleteSuccess: false,
            deletingToken: false,
            isLoading: false,
            tokens: [],
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
            this.isLoading = true;

            if (this.tokenName) {
                createToken(this.tokenName)
                    .then(response => {
                        this.createSuccess = true;
                        this.isLoading = false;

                        setTimeout(() => {
                            this.createSuccess = false;
                            this.creatingToken = false;
                            this.tokenName = '';
                            this.tokens.unshift(response.data);
                        }, 2500);
                    });
            } else {
                this.isLoading = false;
            }
        },
        setTokens() {
            getTokens()
                .then(response => {
                    this.tokens = response.data;
                    this.setUserAuthTokens(this.tokens);
                });
        },
    },
    computed: {
        ...mapState([
            'userAuthTokens',
        ]),
    },
    mounted() {
        if (this.userAuthTokens.length) {
            this.tokens = this.userAuthTokens;
        } else {
            this.setTokens();
        }
    },
};
</script>
