<template>
    <div class="modal modal-confirm" :class="{ 'is-active': isActive }">
        <div class="modal-background" @click="closeModal()"></div>
        <div class="modal-content">
            <div class="notification is-marginless">
                <button
                    class="delete is-medium"
                    @click="closeModal()"
                ></button>
                <div class="modal-icon is-2 has-text-centered">
                    <slot name="icon"></slot>
                </div>
                <div class="has-text-centered">
                    <slot name="title"></slot>
                    <slot name="subtitle"></slot>
                </div>
            </div>
            <footer>
                <slot name="footer"></slot>
            </footer>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isActive: false,
        };
    },
    methods: {
        closeModal() {
            this.isActive = false;
            this.triggerParentCloseModal();
        },
        triggerParentCloseModal() {
            this.$parent.closeModal();
        },
    },
    mounted() {
        this.isActive = true;
    },
};
</script>
