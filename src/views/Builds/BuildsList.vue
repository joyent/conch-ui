<template>
    <div class="builds-list">
        <div class="page-heading">
            <h1 class="title is-3 has-text-weight-bold">Builds</h1>
            <div class="control has-icons-left">
                <input
                    type="text"
                    class="input"
                    placeholder="Search builds"
                    v-model="searchText"
                />
                <span class="icon is-small is-left">
                    <i class="material-icons">search</i>
                </span>
            </div>
            <div class="views-toggle">
                <a class="button is-text" @click="toggleView()">
                    <template v-if="activeView === 'grid'">
                        <i class="material-icons view-list">dehaze</i>
                        <span>List View</span>
                    </template>
                    <template v-else-if="activeView === 'list'">
                        <i class="material-icons view-grid">apps</i>
                        <span>Grid View</span>
                    </template>
                </a>
            </div>
            <i class="material-icons add-build" @click="createBuild()">
                add_circle
            </i>
        </div>
        <div class="cards grid-view" v-if="activeView === 'grid'">
            <div class="card" v-for="build in filteredBuilds" :key="build.name">
                <a @click="viewBuild(build.id)">
                    <div class="card-content">
                        <div class="build-progress">
                            <RadialProgressBar
                                :color="graphColor(build.progress)"
                                :id="build.id"
                                :value="build.progress"
                            />
                        </div>
                        <p class="build-name">{{ build.name }}</p>
                    </div>
                </a>
            </div>
        </div>
        <div class="columns list-view" v-else-if="activeView === 'list'">
            <div class="column is-4">
                <ul>
                    <li
                        class="build-box"
                        v-for="build in filteredBuilds"
                        :key="build.name"
                    >
                        <a @click="selectBuild(build)">
                            <div
                                class="box is-paddingless"
                                :class="{
                                    'is-selected':
                                        selectedBuild.name === build.name,
                                }"
                            >
                                <div class="build-details">
                                    <p class="name is-size-5">
                                        {{ build.name }}
                                    </p>
                                    <p
                                        class="status"
                                        :class="{
                                            'has-text-info':
                                                buildStatus(build) ===
                                                'started',
                                            'has-text-success':
                                                buildStatus(build) ===
                                                'completed',
                                            'has-text-link':
                                                buildStatus(build) ===
                                                'created',
                                        }"
                                    >
                                        {{ buildStatus(build) }}
                                    </p>
                                </div>
                                <div class="build-progress">
                                    <RadialProgressBar
                                        :color="graphColor(build.progress)"
                                        :id="build.id"
                                        :value="build.progress"
                                    />
                                </div>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
            <transition name="fade">
                <div class="column is-8" v-if="!isEmpty(selectedBuild)">
                    <Build :build-id="selectedBuild.id" />
                </div>
            </transition>
        </div>
        <transition name="fade">
            <CreateBuildModal v-if="creatingBuild" />
        </transition>
    </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty';
import search from 'fuzzysearch';
import RadialProgressBar from '@views/components/RadialProgressBar.vue';
import CreateBuildModal from './CreateBuildModal.vue';
import { EventBus } from '@src/eventBus.js';
import { mapActions, mapState } from 'vuex';
import * as Builds from '@api/builds.js';
import Build from './Build.vue';

export default {
    components: {
        Build,
        CreateBuildModal,
        RadialProgressBar,
    },
    data() {
        return {
            activeView: 'grid',
            addDevice: false,
            colors: {
                blue: '#209cee',
                green: '#5cb85c',
                red: '#d9534f',
            },
            creatingBuild: false,
            currentTab: 'OverviewTab',
            devices: [
                'ANDROID1',
                'Astromech 210',
                'Battle Droid',
                'Translator Droid',
                'Navigational Computer',
                'TARS',
                'PLEX',
                'CASE',
                'KIPP',
            ],
            searchText: '',
            selectedBuild: {},
        };
    },
    methods: {
        ...mapActions(['setBuilds']),
        changeTab(tab) {
            this.currentTab = tab;
        },
        closeModal() {
            this.creatingBuild = false;
        },
        createBuild() {
            this.creatingBuild = true;
        },
        getBuilds() {
            Builds.getBuilds().then(response => {
                this.setBuilds(response.data);
            });
        },
        graphColor(progress) {
            return progress === 100 ? this.colors.green : this.colors.blue;
        },
        isEmpty,
        buildStatus(build = null) {
            if (!build) {
                build = this.currentBuild;
            }

            if (build.completed) {
                return 'completed';
            } else if (build.started) {
                return 'started';
            }

            return 'created';
        },
        getUserName(index) {
            return this.selectedBuild.users[index].name;
        },
        selectBuild(build) {
            if (this.selectedBuild.name === build.name) {
                this.selectedBuild = {};
            } else {
                this.selectedBuild = build;

                if (this.activeView === 'grid') {
                    this.$router.push({
                        name: 'adminBuildDetails',
                        params: {
                            buildId: build.id,
                        },
                    });
                }
            }

            localStorage.setItem('mostRecentBuildId', build.id);
        },
        toggleView() {
            if (this.activeView === 'list') {
                this.activeView = 'grid';
            } else {
                this.activeView = 'list';
            }
        },
        viewBuild(buildId) {
            this.$router.push({ name: 'build', params: { buildId } });
        },
    },
    computed: {
        ...mapState(['builds']),
        buildsStarted() {
            return this.builds.filter(build => {
                if (build.started && !build.completed) {
                    return build;
                }
            }).length;
        },
        buildsComplete() {
            return this.builds.filter(build => build.completed === true).length;
        },
        filteredBuilds() {
            const searchText = this.searchText.toLowerCase();
            let builds = this.builds;

            if (searchText) {
                return builds.reduce((acc, build) => {
                    const name = build.name.toLowerCase();

                    if (search(searchText, name)) {
                        acc.push(build);
                    }

                    return acc;
                }, []);
            }

            return builds;
        },
    },
    created() {
        if (!this.builds.length) {
            this.getBuilds();
        }
    },
    mounted() {
        EventBus.$on('close-modal:create-build', () => {
            this.closeModal();
        });

        EventBus.$on('build-created', () => {
            this.getBuilds();
        });
    },
};
</script>
