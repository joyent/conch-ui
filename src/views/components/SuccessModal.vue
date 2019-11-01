<template>
    <div class="success-modal">
        <div class="modal" :class="{ 'is-active': isActive }">
            <div class="modal-background" @click="closeModal()"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Success!</p>
                    <i class="material-icons close" @click="closeModal()">
                        close
                    </i>
                </header>
                <section class="modal-card-body">
                    <p v-if="item">
                        <span class="has-text-white has-text-weight-bold">
                            {{ item }}
                        </span>
                        has been {{ action }}d.
                    </p>
                    <p v-else>
                        {{ itemCount }} {{ itemType }}s have been
                        {{ actionText }}.
                    </p>
                    <br />
                    <a class="button is-success" @click="closeModal()">
                        Close
                    </a>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
import { EventBus } from '@src/eventBus.js';

export default {
    props: {
        action: {
            type: String,
            required: true,
        },
        item: {
            type: String,
            required: false,
            default: '',
        },
        itemCount: {
            type: Number,
            required: false,
            default: 0,
        },
        itemType: {
            type: String,
            required: false,
            default: '',
        },
    },
    data() {
        return {
            isActive: true,
        };
    },
    methods: {
        closeModal() {
            this.isActive = false;
            EventBus.$emit('close-modal:success-modal');
        },
    },
    computed: {
        actionText() {
            const action = this.action;

            if (action) {
                if (action === 'add') {
                    return 'added';
                } else if (action === 'remove') {
                    return 'removed';
                }
            }

            return '';
        },
    },
};
</script>
