<template>
  <div class="overview-tab">
    <div class="box build-dates">
      <div class="box-header">
        <i class="material-icons">schedule</i>
        <p class="heading is-size-5">Build Details</p>
      </div>
      <div class="columns">
        <div class="column is-2">
          <div class="box filter">
            <h2 class="is-6 is-capitalized">Start Date</h2>
            <span v-if="currentBuild.started" class="is-size-4 has-text-info">
              {{ getDate(currentBuild.started) }}
            </span>
            <span class="is-size-4 has-text-info" v-else>Not Started</span>
          </div>
        </div>
        <div class="column is-2">
          <div class="box filter">
            <h2 class="is-6 is-capitalized">Complete Date</h2>
            <span v-if="currentBuild.completed" class="is-size-4 has-text-info">
              {{ getDate(currentBuild.completed) }}
            </span>
            <span class="is-size-4 has-text-info" v-else>Incomplete</span>
          </div>
        </div>
        <div class="column is-2">
          <div class="box filter">
            <h2 class="is-6 is-capitalized">Completed Status</h2>
            <div
              v-if="currentBuild.completed_status"
              style="display: flex; align-items: center"
            >
              <span
                class="is-size-4 is-capitalized"
                :class="{
                  'has-text-info': !currentBuild.completed_status,
                  'has-text-success':
                    currentBuild.completed_status === 'success',
                  'has-text-danger':
                    currentBuild.completed_status === 'failure',
                }"
              >
                {{ currentBuild.completed_status }}
              </span>
            </div>
            <span class="is-size-4 has-text-info" v-else>N/A</span>
          </div>
        </div>
        <div class="column is-3">
          <div class="box filter">
            <h2 class="is-6 is-capitalized">Signed Off By</h2>
            <span v-if="currentBuild.completed" class="is-size-4 has-text-info">
              {{ currentBuild.completed_user.name }}
            </span>
            <span class="is-size-4 has-text-info" v-else>N/A</span>
          </div>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <div class="box is-paddingless">
          <div class="build-devices">
            <div class="box-header">
              <i class="material-icons">dns</i>
              <p class="heading is-size-5">Devices Overview</p>
              <router-link
                class="button view-all"
                :to="{
                  name: 'build-devices',
                  params: { id: currentBuild.id },
                }"
                tag="a"
              >
                <strong>View All Devices</strong>
                <i class="material-icons">arrow_forward</i>
              </router-link>
            </div>
            <p class="subtitle is-5">Phase</p>
            <div class="columns">
              <div class="column" v-for="phase in phaseList" :key="phase">
                <a
                  :class="`filter-devices-phase-${phase}`"
                  @click="
                    $router.push({
                      name: 'build-devices',
                      params: { id: currentBuild.id },
                      query: { health: 'all', phase },
                    })
                  "
                >
                  <div class="box filter">
                    <h2 class="is-6 is-capitalized">
                      {{ phase }}
                    </h2>
                    <span class="is-size-3 has-text-info">
                      {{ getDevicePhaseCount(phase) }}
                    </span>
                  </div>
                </a>
              </div>
            </div>
            <p class="subtitle is-5">Health</p>
            <div class="columns">
              <div
                class="column"
                v-for="status in healthStatusList"
                :key="status"
              >
                <a
                  :class="`filter-devices-health-${status}`"
                  @click="
                    $router.push({
                      name: 'build-devices',
                      params: { id: currentBuild.id },
                      query: {
                        health: status,
                        phase: 'all',
                      },
                    })
                  "
                >
                  <div class="box filter">
                    <h2 class="is-6 is-capitalized">{{ status }}</h2>
                    <span
                      class="is-size-3"
                      :class="{
                        'has-text-success': status === 'pass',
                        'has-text-warning': status === 'unknown',
                        'has-text-danger':
                          status === 'error' || status === 'fail',
                      }"
                    >
                      {{ getDeviceHealthCount(status) }}
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <div class="box is-paddingless">
          <div class="rack-devices">
            <div class="box-header">
              <i class="material-icons">storage</i>
              <p class="heading is-size-5">Racks Overview</p>
              <router-link
                class="button view-all"
                :to="{
                  name: 'build-racks',
                  params: { id: currentBuild.id },
                }"
                tag="a"
              >
                <strong>View All Racks</strong>
                <i class="material-icons">arrow_forward</i>
              </router-link>
            </div>
            <p class="subtitle is-5">Phase</p>
            <div class="columns">
              <div class="column" v-for="phase in phaseList" :key="phase">
                <a
                  :class="`filter-racks-phase-${phase}`"
                  @click="
                    $router.push({
                      name: 'build-racks',
                      params: { id: currentBuild.id },
                      query: { phase, room: 'all' },
                    })
                  "
                >
                  <div class="box filter">
                    <h2 class="is-6 is-capitalized">{{ phase }}</h2>
                    <span class="is-size-3 has-text-info">
                      {{ getRackPhaseCount(phase) }}
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import { mapActions, mapState } from 'vuex';
import { getBuildDevices, getBuildRacks } from '@api/builds.js';

export default {
  data() {
    return {
      healthStatusList: ['pass', 'fail', 'error', 'unknown'],
      phaseList: [
        'integration',
        'installation',
        'production',
        'diagnostics',
        'decommissioned',
      ],
    };
  },
  methods: {
    ...mapActions([
      'setCurrentBuild',
      'setCurrentBuildDevices',
      'setCurrentBuildRacks',
    ]),
    getDate(date) {
      return moment(date).format('YYYY-MM-DD');
    },
    getDeviceHealthCount(health) {
      if (!this.currentBuildDevices.length) {
        return 0;
      }

      return this.currentBuildDevices.filter(device => {
        if (device.health === health) {
          return device;
        }
      }).length;
    },
    getDevicePhaseCount(phase) {
      if (!this.currentBuildDevices.length) {
        return 0;
      }

      return this.currentBuildDevices.filter(device => {
        if (device.phase === phase.toLowerCase()) {
          return device;
        }
      }).length;
    },
    getRackPhaseCount(phase) {
      if (!this.currentBuildRacks.length) {
        return 0;
      }

      return this.currentBuildRacks.filter(rack => {
        if (rack.phase === phase.toLowerCase()) {
          return rack;
        }
      }).length;
    },
    async fetchData() {
      const buildId = this.$route.params.id;
      const currentBuild = this.currentBuild;
      const currentBuildDevices = this.currentBuildDevices;
      const currentBuildRacks = this.currentBuildRacks;

      if (
        !currentBuild ||
        isEmpty(currentBuild) ||
        currentBuild.id !== buildId
      ) {
        const devicesResponse = await getBuildDevices(buildId);
        this.setCurrentBuildDevices(devicesResponse.data);

        const racksResponse = await getBuildRacks(buildId);
        this.setCurrentBuildRacks(racksResponse.data);
      } else {
        if (!currentBuildDevices || currentBuildDevices.length === 0) {
          const devicesResponse = await getBuildDevices(buildId);
          this.setCurrentBuildDevices(devicesResponse.data);
        }

        if (!currentBuildRacks || currentBuildRacks.length === 0) {
          const racksResponse = await getBuildRacks(buildId);
          this.setCurrentBuildRacks(racksResponse.data);
        }
      }
    },
  },
  computed: {
    ...mapState(['currentBuild', 'currentBuildDevices', 'currentBuildRacks']),
  },
  created() {
    this.fetchData();
  },
};
</script>
