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
                            class="material-icons"
                            @click="closeModal()"
                            style="text-align: right"
                        >
                            close
                        </i>
                    </div>
                    <div class="modal-body">
                        <label class="label">Name</label>
                        <input
                            type="text"
                            class="input"
                            v-model="name"
                            placeholder="Token name"
                            @keyup.enter="save()"
                            ref="tokenName"
                        />
                    </div>
                    <div class="modal-footer">
                        <a
                            class="button is-success is-fullwidth"
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
                            Success!
                        </span>
                        <i
                            class="material-icons"
                            @click="closeModal()"
                            style="text-align: right"
                        >
                            close
                        </i>
                    </div>
                    <div class="modal-body">
                        <p>
                            Here's your token. This is the only time you'll be
                            able to see this token, so please store it in a safe
                            place.
                        </p>
                        <p>Keep it secret. Keep it safe.</p>
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
                        <span class="modal-title">
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
import { EventBus } from '@src/eventBus.js';

export default {
    data() {
        return {
            duplicateTokenNameError: false,
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
            EventBus.$emit('close-modal');
        },
        copyToken() {
            this.tokenCopied = true;

            setTimeout(() => {
                this.closeModal();
                this.tokenCopied = false;
            }, 2000);
        },
        save() {
            const name = this.name;
            this.isLoading = true;

            if (name) {
                createToken(name)
                    .then(response => {
                        const token = response.data;

                        this.success = true;
                        this.isLoading = false;
                        this.token = token;

                        EventBus.$emit('create-token', token);
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
                                    this.duplicateTokenNameError = true;
                                    this.isLoading = false;
                                }
                            }
                        }
                    });
            } else {
                this.isLoading = false;
            }
        },
    },
    created() {
        new ClipboardJS('.copy-token');
    },
    mounted() {
        this.$refs.tokenName.focus();
    }
};
</script>
