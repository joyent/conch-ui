<template>
    <div class="modal" :class="{ 'is-active': isActive }">
        <div class="modal-background" @click="closeModal()"></div>
        <div class="modal-content">
            <div class="notification">
                <button
                    class="delete is-medium"
                    @click="closeModal()"
                ></button>
                <div class="columns is-vcentered">
                    <div class="column is-2" style="text-align: center;">
                        <slot name="icon"></slot>
                    </div>
                    <div class="column">
                        <h1 class="title">
                            <slot name="title"></slot>
                        </h1>
                        <p class="subtitle">
                            <slot name="subtitle"></slot>
                        </p>
                        <div class="control" @click="closeModal()">
                            <button class="button is-link">Close</button>
                        </div>
                    </div>
                </div>
            </div>
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
