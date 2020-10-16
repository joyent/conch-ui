<template>
    <Spinner v-if="builds.length < 1 && !noBuildsExist" />
    <section class="builds" v-else>
        <div class="empty-state" v-if="noBuildsExist">
            <img src="../../assets/rack.svg" width="500" />
            <template v-if="currentUser && currentUser.is_admin">
                <p class="empty-state-heading">No builds exist.</p>
                <a
                    class="button is-info create-organization"
                    @click="createBuild()"
                >
                    Create a Build
                </a>
            </template>
            <p v-else class="empty-state-heading">
                You don't have access to any builds.
            </p>
        </div>
        <div
            class="page-heading"
            style="display: flex; align-items: center; margin-bottom: 20px"
        >
            <span class="icon material-icons">layers</span>
            <h1
                class="title is-4 has-text-weight-bold"
                style="margin-left: 8px;"
            >
                Builds
            </h1>
        </div>
        <div style="display: flex">
            <div
                class="control has-icons-left"
                style="margin-bottom: 20px; margin-right: 20px; flex-grow: 1"
            >
                <input
                    type="text"
                    class="input search is-medium"
                    placeholder="Search..."
                    v-model="searchText"
                />
                <span class="icon is-small is-left">
                    <i class="material-icons">search</i>
                </span>
            </div>
            <a
                v-if="currentUser && currentUser.is_admin"
                class="button is-success create-organization"
                @click="createBuild()"
                style="height: 45px; margin-bottom: 20px;"
            >
                <span class="icon">
                    <i class="material-icons">add</i>
                </span>
                <span>New Build</span>
            </a>
        </div>
        <div class="cards grid-view" v-if="activeView === 'grid'">
            <div class="card" v-for="build in filteredBuilds" :key="build.id">
                <router-link
                    :to="{ name: 'build-overview', params: { id: build.id } }"
                    style="display: flex; flex-direction: column; height: 100%;"
                >
                    <div class="card-content" style="flex-grow: 1;">
                        <div class="build-progress">
                            <span
                                class="icon is-large"
                                :class="{
                                    'has-text-success': build.completed,
                                }"
                            >
                                <i
                                    v-if="build.completed"
                                    class="material-icons"
                                    style="font-size: 36px;"
                                    >check_circle</i
                                >
                                <i
                                    v-else-if="build.started"
                                    class="fa fa-circle-notch fa-spin fa-2x"
                                ></i>
                                <i
                                    v-else
                                    class="material-icons"
                                    style="font-size: 36px;"
                                >
                                    more_horiz
                                </i>
                            </span>
                        </div>
                        <p class="build-name">{{ build.name }}</p>
                    </div>
                    <footer
                        class="card-footer"
                        style="
                            justify-content: center;
                            border-bottom-right-radius: 4px;
                            border-bottom-left-radius: 4px;
                            border-top: none;
                        "
                    >
                        <p
                            class="status has-text-weight-bold is-capitalized"
                            :class="`${buildStatusClass(build)}`"
                            style="padding: 8px; font-size: 18px;"
                        >
                            {{ buildStatusText(build) }}
                        </p>
                    </footer>
                </router-link>
            </div>
        </div>
        <!-- <div class="columns list-view" v-else-if="activeView === 'list'">
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
                                    <p
                                        class="name is-size-5"
                                        style="margin-bottom: 4px;"
                                    >
                                        {{ build.name }}
                                    </p>
                                    <p
                                        class="status is-capitalized"
                                        :class="`${buildStatusClass(build)}`"
                                    >
                                        {{ buildStatusText(build) }}
                                    </p>
                                </div>
                                <div class="build-progress">
                                    <span
                                        class="icon is-large"
                                        :class="{
                                            'has-text-success': build.completed,
                                        }"
                                    >
                                        <i
                                            v-if="build.completed"
                                            class="material-icons"
                                            style="font-size: 36px;"
                                            >check_circle</i
                                        >
                                        <i
                                            v-else-if="build.started"
                                            class="fa fa-circle-notch fa-spin fa-2x"
                                        ></i>
                                        <i
                                            v-else
                                            class="material-icons"
                                            style="font-size: 36px;"
                                        >
                                            more_horiz
                                        </i>
                                    </span>
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
        </div> -->
        <transition name="fade">
            <CreateBuildModal v-if="creatingBuild" />
        </transition>
    </section>
</template>

<script>
import isEmpty from 'lodash/isEmpty';
import search from 'fuzzysearch';
import CreateBuildModal from './CreateBuildModal.vue';
import Spinner from '../components/Spinner.vue';
import { EventBus } from '@src/eventBus.js';
import { mapActions, mapState } from 'vuex';
import * as Builds from '@api/builds.js';

export default {
    components: {
        CreateBuildModal,
        Spinner,
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
            noBuildsExist: false,
            searchText: '',
            selectedBuild: {},
        };
    },
    methods: {
        ...mapActions(['setBuilds']),
        closeModal() {
            this.creatingBuild = false;
        },
        createBuild() {
            this.creatingBuild = true;
        },
        getBuilds() {
            Builds.getBuilds().then(response => {
                const builds = response.data;

                if (builds.length) {
                    this.setBuilds(builds);
                } else {
                    this.noBuildsExist = true;
                }
            });
        },
        graphColor(progress) {
            return progress === 100 ? this.colors.green : this.colors.blue;
        },
        isEmpty,
        buildStatusClass(build) {
            if (build.completed) {
                return 'has-text-success';
            } else if (build.started) {
                return 'has-text-info';
            } else {
                return 'has-text-link';
            }
        },
        buildStatusText(build) {
            if (build.completed) {
                return 'completed';
            } else if (build.started) {
                return 'started';
            } else {
                return 'created';
            }
        },
        selectBuild(build) {
            if (this.selectedBuild.name === build.name) {
                this.selectedBuild = {};
            } else {
                this.selectedBuild = build;
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
    },
    computed: {
        ...mapState(['builds', 'currentUser']),
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
        if (!this.builds || !this.builds.length) {
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
