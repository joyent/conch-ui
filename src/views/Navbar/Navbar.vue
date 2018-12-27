<template>
<div class="navbar" role="navigation">
    <div class="navbar-brand">
        <div class="navbar-item">
            <a class="title">Conch</a>
        </div>
        <div class="navbar-burger" :class="{ 'is-active': menuActive }" @click="menuActive = !menuActive">
            <span></span>
            <span></span>
            <span></span>
        </div>
    </div>
    <div class="navbar-menu" :class="{ 'is-active': menuActive }">
        <div class="navbar-end">
            <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link">
                    {{ this.currentWorkspace.name }}
                </a>
                <div class="navbar-dropdown is-right">
                    <ul v-if="sortedWorkspaceRoots.length">
                        <li v-for="(workspace, index) in sortedWorkspaceRoots" :key="index">
                            <a class="navbar-item" @click="changeWorkspace(workspace.id)">
                                {{ workspace.name }}
                            </a>
                            <ul v-if="sortedWorkspaceGraph(workspace.id)">
                                <li v-for="(sortedWorkspace, index) in sortedWorkspaceGraph(workspace.id)" :key="index">
                                    <a class="navbar-item" @click="changeWorkspace(sortedWorkspace.id)">
                                        {{ sortedWorkspace.name }}
                                    </a>
                                    <ul>
                                        <li v-for="(sortedSubWorkspace, index) in sortedWorkspaceGraph(sortedWorkspace.id)" :key="index">
                                            <a class="navbar-item" @click="changeWorkspace(sortedSubWorkspace.id)">
                                                {{ sortedSubWorkspace.name }}
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import keyBy from 'lodash/keyBy';
import sortBy from 'lodash/sortBy';
import { mapState } from 'vuex';

export default {
    data() {
        return {
            menuActive: false,
        };
    },
    methods: {
        changeWorkspace(workspaceId) {
            this.menuActive = false;

            const route = this.$route.path;
            const routeSuffix = route.substring(route.indexOf('/', 1));

            this.$router.push({ path: `/${this.workspaceId}/${routeSuffix}` })
        },
        sortedWorkspaceGraph(workspaceId) {
            return sortBy(this.workspaceGraph.graph[workspaceId], ['name']);
        },
    },
    computed: {
        ...mapState([
            'currentWorkspace',
            'workspaces',
        ]),
        currentWorkspaceId() {
            return this.currentWorkspace.id;
        },
        sortedWorkspaceRoots() {
            return sortBy(this.workspaceGraph.roots, ['name'])
        },
        workspaceGraph() {
            return this.workspaces.reduce((acc, workspace) => {
                // global workspace
                if (!workspace.parent_id) {
                    acc.roots.push(workspace);
                    return acc;
                }

                if (acc.graph[workspace.parent_id]) {
                    acc.graph[workspace.parent_id].push(workspace);
                } else {
                    acc.graph[workspace.parent_id] = [workspace];
                }

                let workspaceIdToWorkspace = keyBy(this.workspaces, 'id');

                // if the parent isn't present, then the workspace is a root
                if (!workspaceIdToWorkspace[workspace.parent_id]) {
                    acc.roots.push(workspace);
                }

                return acc;
            }, { roots: [], graph: {} });
        },
    },
};
</script>
