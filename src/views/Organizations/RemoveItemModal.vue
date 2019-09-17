<template>
    <div class="remove-item-modal">
        <BaseModal>
            <template v-slot:icon>
                <i class="far fa-4x fa-trash-alt has-text-danger"></i>
            </template>
            <template v-slot:title>
                <h1 class="title">
                    Remove <span class="is-capitalized">{{ type }}</span>?
                </h1>
            </template>
            <template v-slot:body>
                <p class="subtitle">
                    Are you sure you want to remove
                    <strong class="has-text-white">{{ item.name }}</strong>?
                </p>
            </template>
            <template v-slot:footer>
                <a
                    class="button confirm is-success is-fullwidth"
                    @click="removeItem()"
                >
                    <span>Remove {{ item.name }}</span>
                    <i class="fas fa-lg fa-long-arrow-alt-right"></i>
                </a>
            </template>
        </BaseModal>
    </div>
</template>

<script>
import BaseModal from '@src/views/components/BaseModal.vue';
import { EventBus } from '@src/eventBus.js';
import { removeMemberFromOrganization } from '@api/organizations.js';

export default {
    props: {
        item: {
            type: Object,
            required: true,
        },
        organizationId: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
    },
    components: {
        BaseModal,
    },
    methods: {
        closeModal() {

        },
        removeItem() {
            if (this.type === 'member') {
                removeMemberFromOrganization(this.organizationId, this.item.id);
            }
        },
    },
    // NEEDED?
    /* eslint-disable */
    mounted() {
        EventBus.$on('closeModal:baseModal', () => {
            this.closeModal();
        });
    },
};
</script>
