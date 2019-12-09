<template>
    <div>
        <BaseModal class="phase-update-modal" v-if="!updateSuccess">
            <template v-slot:icon>
                <i class="fas fa-4x fa-hdd" v-if="item === 'device'"></i>
                <i class="fas fa-4x fa-server" v-else-if="item === 'rack'"></i>
            </template>
            <template v-slot:title>
                <h1 class="title">
                    Update <span class="is-capitalized">{{ item }}</span> Phase
                </h1>
            </template>
            <template v-slot:body>
                <div
                    class="subtitle has-text-centered"
                    style="margin-bottom: 10px;"
                >
                    <span class="device-id" v-if="item === 'device'">
                        Device:
                        <strong class="has-text-white">{{
                            itemData.serial_number
                        }}</strong>
                    </span>
                    <span class="rack-name" v-else-if="item === 'rack'">
                        Rack:
                        <strong class="has-text-white">{{
                            itemData.name
                        }}</strong>
                    </span>
                </div>
                <div
                    class="columns"
                    style="position: relative; margin: 10px 0;"
                >
                    <div class="column phase">
                        <p
                            class="subtitle"
                            style="margin-bottom: 20px; padding: 0;"
                        >
                            Current Phase:
                        </p>
                        <p class="is-capitalized current-phase">
                            {{ itemData.phase }}
                        </p>
                    </div>
                    <div class="divider is-vertical">
                        <i
                            class="fas fa fa-long-arrow-alt-right has-text-grey-light"
                        ></i>
                    </div>
                    <div class="column">
                        <p
                            class="subtitle"
                            style="margin-bottom: 20px; padding: 0;"
                        >
                            New Phase:
                        </p>
                        <div class="select selected-phase">
                            <select v-model="selectedPhase">
                                <option
                                    v-for="phase in phaseOptions"
                                    :key="phase.value"
                                    :value="phase.value"
                                >
                                    {{ phase.text }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
                <div
                    class="field"
                    v-if="item === 'rack'"
                    style="display: flex; justify-content: center; align-items: center;"
                >
                    <label class="label" style="margin-bottom: 0;">
                        Update phases in rack devices?
                    </label>
                    <label class="switch" style="margin-left: 20px;">
                        <input
                            type="checkbox"
                            :checked="updateRackDevices"
                            v-model="updateRackDevices"
                            :true-value="true"
                            :false-value="false"
                        />
                        <span class="slider round is-success"></span>
                    </label>
                    <span style="margin-left: 12px; width: 22px;">
                        <strong v-if="updateRackDevices">Yes</strong>
                        <strong v-else>No</strong>
                    </span>
                </div>
            </template>
            <template v-slot:footer>
                <a
                    class="button confirm is-success is-fullwidth"
                    :class="{ 'is-loading': isLoading }"
                    @click="updatePhase()"
                    v-if="!samePhase"
                >
                    <span>
                        Update phase to
                        <strong class="has-text-white is-capitalized">{{
                            selectedPhase
                        }}</strong>
                    </span>
                    <i class="fas fa-lg fa-long-arrow-alt-right"></i>
                </a>
                <a class="button confirm is-danger is-fullwidth" v-else>
                    <span>
                        This {{ item }} is already in the
                        {{ selectedPhase }} phase!
                    </span>
                </a>
            </template>
        </BaseModal>
        <BaseModal v-else-if="!updatingPhase && updateSuccess">
            <template v-slot:icon>
                <i class="far fa-4x fa-check-circle has-text-success"></i>
            </template>
            <template v-slot:title>
                <h1 class="title">Success!</h1>
            </template>
            <template v-slot:body>
                <p class="subtitle">
                    <span>
                        The phase for
                        <strong class="has-text-white" v-if="item === 'device'">
                            {{ itemData.serial_number }}
                        </strong>
                        <strong
                            class="has-text-white"
                            v-else-if="item === 'rack'"
                        >
                            {{ itemData.name }}
                        </strong>
                        has been set to
                        <strong class="has-text-white">
                            {{ selectedPhase }}
                        </strong>
                        .
                    </span>
                </p>
            </template>
            <template v-slot:footer>
                <a
                    class="button confirm is-success is-fullwidth"
                    @click="closeModal()"
                >
                    <span>Great!</span>
                    <i class="fas fa-lg fa-long-arrow-alt-right"></i>
                </a>
            </template>
        </BaseModal>
    </div>
</template>

<script>
import BaseModal from '@src/views/components/BaseModal.vue';
import { EventBus } from '@src/eventBus.js';
import { setDevicePhase } from '@api/device.js';
import { setRackPhase } from '@api/racks.js';
import { getRackById } from '@api/workspaces.js';
import { mapActions, mapState } from 'vuex';

export default {
    props: {
        item: {
            type: String,
            required: true,
        },
        itemData: {
            type: Object,
            required: true,
        },
    },
    components: {
        BaseModal,
    },
    data() {
        return {
            isLoading: false,
            newPhase: '',
            phaseOptions: [
                { text: 'Integration', value: 'integration' },
                { text: 'Installation', value: 'installation' },
                { text: 'Production', value: 'production' },
                { text: 'Diagnostics', value: 'diagnostics' },
                { text: 'Decommissioned', value: 'decommissioned' },
            ],
            selectedPhase: 'integration',
            updatingPhase: false,
            updateRackDevices: true,
            updateSuccess: false,
        };
    },
    methods: {
        ...mapActions(['setActiveDeviceDetails', 'setRackLayout']),
        closeModal() {
            this.updateSuccess = false;
            EventBus.$emit('closeModal:baseModal');
        },
        updatePhase() {
            this.isLoading = true;
            const data = { phase: this.selectedPhase };
            const id = this.itemData.id;

            if (this.item === 'device') {
                setDevicePhase(id, data).then(response => {
                    this.setActiveDeviceDetails(response.data);
                    this.isLoading = false;
                    this.updatingPhase = false;
                    this.updateSuccess = true;
                });
            } else if (this.item === 'rack') {
                const params = { rack_only: this.updateRackDevices ? 0 : 1 };

                setRackPhase(id, data, params).then(() => {
                    getRackById(
                        this.currentWorkspace.id,
                        this.rackLayout.id
                    ).then(response => {
                        this.setRackLayout(response);
                        this.isLoading = false;
                        this.updatingPhase = false;
                        this.updateSuccess = true;
                    });
                });
            }
        },
    },
    computed: {
        ...mapState(['currentWorkspace', 'rackLayout']),
        samePhase() {
            return this.itemData.phase === this.selectedPhase;
        },
    },
};
</script>
