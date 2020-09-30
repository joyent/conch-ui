<template>
    <div class="create-token-modal">
        <div class="modal" :class="{ 'is-active': isActive }">
            <div class="modal-background" @click="closeModal()"></div>
            <div class="modal-content">
                <div class="notification" v-if="!success">
                    <div class="modal-heading">
                        <span class="modal-title">
                            Create Token
                        </span>
                        <i
                            class="material-icons close"
                            @click="closeModal()"
                            style="text-align: right"
                        >
                            close
                        </i>
                    </div>
                    <div class="modal-body">
                        <label class="label">Name</label>
                        <div
                            class="control"
                            :class="{
                                'has-icons-left':
                                    emptyNameError || duplicateTokenError,
                            }"
                        >
                            <input
                                type="text"
                                class="input"
                                :class="{
                                    'has-error':
                                        emptyNameError || duplicateTokenError,
                                }"
                                v-model="name"
                                placeholder="Token name"
                                @keyup.enter="save()"
                                ref="tokenName"
                            />
                            <span
                                class="icon is-left"
                                v-if="emptyNameError || duplicateTokenError"
                            >
                                <i class="material-icons has-text-danger">
                                    error
                                </i>
                            </span>
                            <p
                                class="error-message has-text-danger"
                                v-if="emptyNameError"
                            >
                                A token name is required.
                            </p>
                            <p
                                class="error-message has-text-danger"
                                v-if="duplicateTokenError"
                            >
                                You already have a token with that name.
                            </p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <a
                            class="button create is-success is-fullwidth"
                            :class="{ 'is-loading': isLoading }"
                            @click="save()"
                        >
                            Create Token
                        </a>
                    </div>
                </div>
                <div class="notification" v-if="success && !tokenCopied">
                    <div class="modal-heading">
                        <span class="modal-title">
                            <i class="material-icons has-text-success">
                                check_circle
                            </i>
                            Token Created
                        </span>
                        <i
                            class="material-icons close"
                            @click="closeModal()"
                            style="text-align: right"
                        >
                            close
                        </i>
                    </div>
                    <div class="modal-body">
                        <article class="notification success is-dark">
                            This is the only time you will be able to see this
                            token&#46; Please store it where you will be able to
                            find it later.
                        </article>
                        <textarea
                            id="token"
                            class="textarea has-fixed-size token"
                            rows="7"
                            v-model="token.token"
                        >
                        </textarea>
                    </div>
                    <div class="modal-footer">
                        <a
                            class="button copy-token is-success is-fullwidth"
                            v-if="!tokenCopied"
                            :data-clipboard-text="token.token"
                            @click="copyToken()"
                        >
                            Copy Token to Clipboard
                        </a>
                    </div>
                </div>
                <div
                    class="notification token-copied"
                    v-if="success && tokenCopied"
                >
                    <div class="modal-heading">
                        <i class="material-icons has-text-success">
                            check_circle
                        </i>
                        <span class="modal-title copied">
                            Token copied to clipboard
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ClipboardJS from 'clipboard';
import { createToken } from '@api/users.js';

export default {
    data() {
        return {
            duplicateTokenError: false,
            emptyNameError: false,
            isActive: true,
            isLoading: false,
            name: '',
            success: false,
            token: {},
            tokenCopied: false,
        };
    },
    methods: {
        closeModal() {
            this.isActive = false;
            this.$emit('close-modal');
        },
        copyToken() {
            this.tokenCopied = true;

            setTimeout(() => {
                this.closeModal();
                this.tokenCopied = false;
            }, 3000);
        },
        focusTokenNameInput() {
            this.$refs.tokenName.focus();
        },
        save() {
            const name = this.name;
            this.isLoading = true;

            if (name) {
                createToken(name)
                    .then(response => {
                        const token = response.data;

                        this.token = token;
                        this.success = true;
                        this.isLoading = false;

                        this.$emit('create-token', token);
                    })
                    .catch(error => {
                        if (error.status === 400) {
                            const errorData = error.data;
                            if (errorData && errorData.error) {
                                if (
                                    errorData.error.includes(
                                        `name "${name}" is already in use`
                                    )
                                ) {
                                    this.duplicateTokenError = true;
                                    this.isLoading = false;
                                }
                            }
                        }
                    });
            } else {
                this.isLoading = false;
                this.emptyNameError = true;
            }
        },
    },
    created() {
        new ClipboardJS('.copy-token');
    },
    mounted() {
        this.focusTokenNameInput();
    },
};
</script>
