<template>
    <div class="modal" @click="navigate">
        <div class="modal-background"></div>
        <div class="modal-content content">
            <div class="box">
                <div class="subtitle has-text-centered">Cannot load workspace</div>
                <p>You may not access Workspace ID <span class="has-text-weight-bold">{{ urlWorkspaceId }}</span>, as specified in the URL. Click anywhere to load a different workspace you may access.</p>
                <p>The URL may be incorrect or you may not have access. Ask a workspace administrator if you require access to this workspace.</p>
            </div>
        </div>
        <button class="modal-close is-large"></button>
    </div>
</template>

<script>
export default {
    props: {
        urlWorkspaceId: {
            required: true,
        },
    },
    methods: {
        navigate() {
            this.$router.push({ path: '/' });
        },
    },
};
</script>
