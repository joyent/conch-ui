<template>
    <div class="page-not-found">
        <div class="container">
            <div class="columns">
                <div class="column is-6 content">
                    <h1 class="title">404</h1>
                    <h2 class="subtitle is-5">
                        The page you're looking for must be in another castle.
                    </h2>
                    <hr>
                    <div class="action">
                        <div class="text">
                            <p class="is-size-5">
                                Head back to the last known workspace.
                            </p>
                            <p class="is-size-5">
                                If you think something is broken, please report it.
                            </p>
                        </div>
                        <p class="buttons">
                            <a
                                class="button is-rounded is-outlined is-info is-uppercase has-text-weight-semibold"
                                @click="routeLastKnownWorkspace()"
                            >
                                    Last Known Workspace
                            </a>
                            <a
                                class="button is-rounded is-outlined is-danger is-uppercase has-text-weight-semibold"
                                href="https://github.com/joyent/conch-ui/issues/new"
                                target="_blank"
                            >
                                Report a Problem
                            </a>
                        </p>
                    </div>
                </div>
                <div class="column is-5 is-offset-1 image">
                    <img src="../../assets/castle.svg" width="500">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { loadCurrentWorkspace } from '../../store/getters';
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
                currentWorkspaceId = this.workspaces[0].id
            }

            this.$router.push({
                name: 'status',
                params: { currentWorkspace: currentWorkspaceId },
            });
        },
    },
    computed: {
        ...mapGetters([
            'currentWorkspaceId',
            'loadCurrentWorkspace',
        ]),
        ...mapState([
            'workspaces'
        ]),
    },
};
</script>
