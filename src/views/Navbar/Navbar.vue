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
                    {{ this.currentWorkspaceName }}
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
import { EventBus } from '@src/eventBus.js';
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
    data() {
        return {
            menuActive: false,
        };
    },
    methods: {
        ...mapActions([
            'setCurrentWorkspace',
        ]),
        changeWorkspace(workspaceId) {
            this.menuActive = false;

            this.setCurrentWorkspace(this.loadCurrentWorkspace(workspaceId));
            sessionStorage.setItem('currentWorkspace', workspaceId);

            let name = this.$route.name;
            let params = {
                currentWorkspace: workspaceId,
            };

            if (name === 'status') {
                EventBus.$emit('changeWorkspace:status');
            } else if (name === 'devices' || name === 'device') {
                if (name === 'device') {
                    name = 'devices';
                }

                EventBus.$emit('changeWorkspace:devices');
            } else {
                if (name === 'datacenterRoom' || name === 'datacenterRack' || name === 'datacenterDevice') {
                    name = 'datacenter';
                }

                EventBus.$emit('changeWorkspace:datacenter');
            }

            this.$router.push({ name: name, params: params });
        },
        sortedWorkspaceGraph(workspaceId) {
            return sortBy(this.workspaceGraph.graph[workspaceId], ['name']);
        },
    },
    computed: {
        ...mapGetters([
            'currentWorkspaceName',
            'loadCurrentWorkspace',
        ]),
        ...mapState([
            'workspaces',
        ]),
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
