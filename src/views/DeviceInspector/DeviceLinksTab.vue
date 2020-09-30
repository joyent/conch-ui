<template>
    <section class="device-links-tab">
        <hr style="margin-bottom: 1.5rem;" />
        <article class="message is-danger" v-if="showErrorMessage">
            <div class="message-header">
                <p>{{ `Error: ${errorMessage}` }}</p>
                <button
                    class="delete"
                    aria-label="delete"
                    @click="showErrorMessage = false"
                ></button>
            </div>
        </article>
        <div class="field has-addons" style="margin-bottom: 1.5rem;">
            <div class="control has-icons-left" style="width: 100%;">
                <input
                    class="input"
                    type="text"
                    placeholder="Add a link"
                    v-model="link"
                />
                <span class="icon is-small is-left">
                    <i class="fas fa-link"></i>
                </span>
            </div>
            <div class="control">
                <a
                    class="button is-info"
                    :class="{ 'is-loading': isLoadingAddLinks }"
                    :disabled="!link || isLoadingAddLinks"
                    @click="link ? addLink() : null"
                    style="height: 46px;"
                    >Add Link</a
                >
            </div>
        </div>
        <div
            style="display: flex; flex-direction: column;"
            v-if="deviceHasLinks"
        >
            <div class="columns" v-if="deviceHasLinks">
                <div class="column is-12">
                    <table
                        class="table is-bordered is-striped"
                        style="width: 100%;"
                    >
                        <tbody>
                            <tr
                                v-for="(deviceLink, index) in links"
                                :key="index"
                            >
                                <td
                                    style="
                                            display: flex;
                                            align-items: center;
                                        "
                                >
                                    <a :href="deviceLink" target="_blank">{{
                                        deviceLink
                                    }}</a>
                                    <div class="spacer"></div>
                                    <a
                                        :disabled="isLoadingRemoveLinks"
                                        class="button"
                                        @click="confirmLinkRemoval(deviceLink)"
                                    >
                                        <div class="icon">
                                            <i class="fas fa-trash-alt"></i>
                                        </div>
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="columns">
                <div class="column is-6 is-offset-3">
                    <a
                        class="button is-danger is-fullwidth"
                        :class="{ 'is-loading': isLoadingRemoveLinks }"
                        :disabled="isLoadingRemoveLinks"
                        @click="confirmLinkRemoval()"
                        >Remove All Device Links</a
                    >
                </div>
            </div>
        </div>
        <p class="has-text-centered" v-else>No links available.</p>
        <div class="modal confirm-action" :class="{ 'is-active': isActive }">
            <div class="modal-background" @click="isActive = false"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title is-capitalized has-text-left"
                        >Confirm Action</p
                    >
                    <i class="material-icons close" @click="isActive = false">
                        close
                    </i>
                </header>
                <section class="modal-card-body">
                    <div class="modal-panel">
                        <p class="has-text-centered" v-if="link"
                            >Are you sure you want to remove this link?</p
                        >
                        <p class="has-text-centered" v-else
                            >Are you sure you want to remove all device
                            links?</p
                        >
                    </div>
                    <div class="spacer"></div>
                    <div class="buttons-group">
                        <a class="button cancel" @click="isActive = false">
                            Cancel
                        </a>
                        <a
                            class="button is-danger is-capitalized action-button"
                            @click="removeDeviceLinks()"
                        >
                            {{ `Remove Link${link ? '' : 's'}` }}
                        </a>
                    </div>
                </section>
            </div>
        </div>
    </section>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import {
    addDeviceLinks,
    getDeviceDetails,
    removeDeviceLinks,
} from '@api/devices.js';

export default {
    computed: {
        ...mapState(['activeDeviceDetails']),
        deviceHasLinks() {
            return (
                this.activeDeviceDetails &&
                this.activeDeviceDetails.links &&
                this.activeDeviceDetails.links.length
            );
        },
    },
    data() {
        return {
            errorMessage: '',
            isActive: false,
            isLoadingAddLinks: false,
            isLoadingRemoveLinks: false,
            link: '',
            links: [],
            loading: false,
            showAddLinkDialog: false,
            showErrorMessage: false,
        };
    },
    methods: {
        ...mapActions(['setActiveDeviceDetails']),
        async addLink() {
            this.isLoadingAddLinks = true;

            try {
                await addDeviceLinks(this.activeDeviceDetails.id, [this.link]);
                await this.refetchDevice();
                this.showErrorMessage = false;
                this.errorMessage = '';
                this.isLoadingAddLinks = false;
                this.link = '';
            } catch (e) {
                const errorMessage = e && e.data && e.data.error;

                if (errorMessage === 'request did not match required format') {
                    this.errorMessage = 'Link is not in the required format';
                } else {
                    this.errorMessage = errorMessage;
                }

                this.showErrorMessage = true;
                this.isLoadingAddLinks = false;
            }
        },
        confirmLinkRemoval(link = null) {
            if (link) {
                this.link = link;
            } else {
                this.link = '';
            }

            this.isActive = true;
        },
        async refetchDevice() {
            const response = await getDeviceDetails(
                this.activeDeviceDetails.id
            );
            const deviceDetails = response.data;
            this.setActiveDeviceDetails(deviceDetails);
            this.links = deviceDetails.links;
        },
        async removeDeviceLinks() {
            this.isActive = false;
            let data = null;
            this.isLoadingRemoveLinks = true;

            if (this.link) {
                data = {
                    links: [this.link],
                };
            }

            try {
                await removeDeviceLinks(this.activeDeviceDetails.id, data);
                await this.refetchDevice();
                this.isLoadingRemoveLinks = false;
            } catch (e) {
                const errorMessage = e && e.data && e.data.error;
                this.errorMessage = errorMessage;
                this.showErrorMessage = true;
                this.isLoadingRemoveLinks = false;
            }
        },
    },
    mounted() {
        this.links = this.activeDeviceDetails.links;
    },
};
</script>
