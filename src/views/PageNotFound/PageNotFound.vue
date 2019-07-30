<template>
    <div class="page-not-found hero is-fullheight">
        <div class="content-left">
            <h1 class="title">404</h1>
            <h2 class="subtitle is-5">
                The page you're looking for is... missing.
            </h2>
            <hr />
            <p class="is-size-5">
                Head back to the last known workspace.
            </p>
            <p class="is-size-5">
                If you think something is broken, please report it.
            </p>
            <div class="buttons">
                <a
                    class="button is-outlined is-info is-uppercase has-text-weight-semibold"
                    @click="routeLastKnownWorkspace()"
                >
                    Last Known Workspace
                </a>
                <a
                    class="button is-outlined is-danger is-uppercase has-text-weight-semibold"
                    href="https://github.com/joyent/conch-ui/issues/new"
                    target="_blank"
                >
                    Report a Problem
                </a>
            </div>
        </div>
        <div class="content-right">
            <img src="../../assets/taken.svg" width="550" />
        </div>
    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
    methods: {
        routeLastKnownWorkspace() {
            let currentWorkspaceId = this.currentWorkspaceId;

            if (!currentWorkspaceId) {
                const routeParams = this.$route.params;

                if (routeParams && routeParams.currentWorkspace) {
                    this.loadCurrentWorkspace(routeParams.currentWorkspace);
                }
            }

            if (!currentWorkspaceId) {
                currentWorkspaceId = this.loadCurrentWorkspace;
            }

            if (!currentWorkspaceId) {
                currentWorkspaceId = this.workspaces[0].id;
            }

            this.$router.push({
                name: 'status',
                params: { currentWorkspace: currentWorkspaceId },
            });
        },
    },
    computed: {
        ...mapGetters(['currentWorkspaceId', 'loadCurrentWorkspace']),
        ...mapState(['workspaces']),
    },
};
</script>
