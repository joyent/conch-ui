<template>
    <div class="remove-item-modal">
        <div class="modal" :class="{ 'is-active': isActive }">
            <div class="modal-background" @click="closeModal()"></div>
            <div class="modal-content notification">
                <i class="material-icons close" @click="closeModal()">
                    close
                </i>
                <p class="has-text-centered is-size-5">
                    Are you sure you want to remove
                    <span class="name">{{ item.name }}</span>?
                </p>
                <div class="button-group">
                    <a class="button" @click="closeModal()">Cancel</a>
                    <a
                        class="button is-danger is-capitalized"
                        @click="removeItem()"
                    >
                        Remove {{ itemType }}
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { EventBus } from '@src/eventBus.js';
import * as Builds from '@api/builds.js';

export default {
    props: {
        build: {
            type: Object,
            required: true,
        },
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
        removeItem() {
            if (this.itemType === 'user') {
                Builds.removeUserFromBuild(this.build.id, this.item.id).then(
                    () => {
                    // show success / failure modal
                    }
                );
            }
        },
    },
};
</script>
