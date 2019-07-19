<template>
    <div class="remove-item-modal">
        <div class="modal" :class="{ 'is-active': isActive }">
            <div class="modal-background" @click="closeModal()"></div>
            <div class="modal-content notification">
                <i
                    class="material-icons close"
                    @click="closeModal()"
                >
                    close
                </i>
                <p class="has-text-centered is-size-5">
                    Are you sure you want to remove <span class="name">{{ item.name }}</span>?
                </p>
                <div class="button-group">
                    <a class="button" @click="closeModal()">Cancel</a>
                    <a class="button is-danger is-capitalized">
                        Remove {{ itemType }}
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { EventBus } from '@src/eventBus.js';

export default {
    props: {
        item: {
            type: Object,
            required: true,
        },
        itemType: {
            type: String,
            required: true,
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

            EventBus.$emit('close-modal:remove-item');
        },
    },
};
</script>
