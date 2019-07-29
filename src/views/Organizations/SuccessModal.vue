<template>
    <div class="success-modal">
        <div class="modal" :class="{ 'is-active': isActive }">
            <div class="modal-background"></div>
            <div class="modal-content" style="width: 320px;">
                <div
                    class="notification has-text-centered"
                    style="padding: 30px; display: flex; flex-direction: column"
                >
                    <i
                        class="material-icons close"
                        @click="closeModal()"
                        style="text-align: right"
                    >
                        close
                    </i>
                    <i
                        class="material-icons has-text-info"
                        style="margin: 30px 0; font-size: 124px"
                    >
                        cake
                    </i>
                    <p class="title">Success!</p>
                    <p>
                        <span class="has-text-white has-text-weight-bold">
                            {{ organizationName }}
                        </span>
                        has been successfully created.
                    </p>
                    <p
                        class="has-text-white has-text-weight-bold"
                        style="margin: 20px 0;"
                    >
                        <a>View Organization</a>
                    </p>
                    <a
                        class="button is-success is-fullwidth"
                        style="border-radius: 3px;"
                        @click="closeModal()"
                    >
                        Close
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        organizationName: {
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
