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
                    <p>{{ name }} has been {{ action }}d.</p>
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
export default {
    props: {
        action: {
            type: String,
            required: true,
        },
        name: {
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
        },
    },
};
</script>
