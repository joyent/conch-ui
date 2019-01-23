<template>
    <section class="hero is-fullheight">
        <div class="hero-body">
            <div class="container has-text-centered">
                <div class="column is-4 is-offset-4">
                    <div class="box">
                        <div class="h3 title">Login to Conch</div>
                        <p class="subtitle has-text-warning" v-if="badLoginAttempt">Invalid email address or password</p>
                        <form>
                            <div class="field">
                                <div class="control">
                                    <input
                                        type="email"
                                        class="input is-info is-fullwidth is-rounded"
                                        placeholder="Email address"
                                        v-model="emailAddress"
                                    >
                                </div>
                            </div>
                            <div class="field">
                                <div class="control">
                                    <input
                                        type="password"
                                        class="input is-info is-fullwidth is-rounded"
                                        placeholder="Password"
                                        v-model="password"
                                    >
                                </div>
                            </div>
                            <button
                                type="button"
                                class="button is-primary is-fullwidth"
                                :class="{ 'is-loading': isLoading }"
                                @click="signIn"
                            >
                            Login
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import isEmpty from 'lodash/isEmpty';
import { mapActions, mapState } from 'vuex';
import { login } from '../../api/authentication.js';
import { getAllRacks, loadAllWorkspaces, getDevices } from '../../api/workspaces.js';
import { roomToProgress } from '../shared/utils.js';

export default {
    data() {
        return {
            badLoginAttempt: false,
            currentWorkspaceId: '',
            emailAddress: '',
            isLoading: false,
            password: '',
        };
    },
    methods: {
        ...mapActions([
            'setAllDevices',
            'setAllRacks',
            'setAllRooms',
            'setCurrentWorkspace',
            'setWorkspaces',
        ]),
        initWorkspaceData() {
            return loadAllWorkspaces()
                .then(response => {
                    this.setWorkspaces(response.data);
                    this.setCurrentWorkspace(this.$store.getters.loadCurrentWorkspace());
                    this.currentWorkspaceId = this.$store.getters.currentWorkspaceId;

                    localStorage.setItem('currentWorkspace', this.currentWorkspaceId);

                    if (!isEmpty(this.allRacks)) {
                        this.setRooms(this.allRacks);
                    } else {
                        getAllRacks(this.currentWorkspaceId)
                            .then(response => {
                                this.setAllRacks(response.data);
                                this.setRooms(response.data);
                            });
                    }

                    return Promise.resolve();
                });
        },
        setRooms(rooms) {
            let rackRooms = Object.keys(rooms)
                .sort()
                .reduce((acc, name) => {
                    let racks = rooms[name];
                    let progress = roomToProgress(racks);
                    acc.push({
                        name,
                        racks,
                        progress,
                    });

                    return acc;
                }, []);

            this.setAllRooms(rackRooms);
        },
        signIn() {
            this.isLoading = true;

            let data = {
                user: this.emailAddress,
                password: this.password,
            };

            login(data)
                .then(response => {
                    this.initWorkspaceData()
                        .then(() => {
                            this.$router.push({ name: 'status', params: { currentWorkspace: this.currentWorkspaceId } });
                        });
                })
                .catch((error) => {
                    this.isLoading = false;
                    this.badLoginAttempt = true;
                });
        },
    },
    computed: {
        ...mapState([
            'allRacks',
        ]),
    },
};
</script>
