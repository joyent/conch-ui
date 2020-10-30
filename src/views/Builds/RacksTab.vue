<template>
  <div class="racks-tab">
    <spinner v-if="fetchingData"></spinner>
    <div v-else class="columns">
      <div class="column">
        <div class="members-table is-paddingless">
          <div class="datatable-header">
            <span class="heading is-size-6 is-marginless">
              {{ `Racks (${filteredRacks.length})` }}
            </span>
            <div class="control has-icons-left has-icons-right">
              <input
                type="text"
                class="input search"
                v-model="searchText"
                placeholder="Search..."
              />
              <span class="icon is-small is-left">
                <i class="material-icons search">search</i>
              </span>
            </div>
            <div class="select-with-label phase">
              <label class="select-label">Phase</label>
              <div class="select device-phase">
                <select
                  v-model="phaseFilter"
                  class="is-capitalized"
                  @change="changeFilter($event, 'phase')"
                >
                  <option value="all">All</option>
                  <option :value="phase" v-for="phase in phases" :key="phase">
                    {{ phase }}
                  </option>
                </select>
              </div>
            </div>
            <div class="select-with-label phase">
              <label class="select-label">Datacenter Room Alias</label>
              <div class="select device-phase">
                <select
                  v-model="datacenterRoomFilter"
                  class="is-capitalized"
                  @change="changeFilter($event, 'room')"
                >
                  <option value="all" selected>All</option>
                  <option
                    v-for="(alias, index) in availableDatacenterRooms"
                    :key="index"
                    :value="alias"
                  >
                    {{ alias }}
                  </option>
                </select>
              </div>
            </div>
            <i
              class="material-icons has-text-success"
              @click="showAddRackModal()"
            >
              add_circle
            </i>
          </div>
          <table
            class="table is-hoverable is-fullwidth"
            v-if="filteredRacks.length"
          >
            <thead>
              <th v-for="header in headers" :key="header">
                <a
                  class="table-header-filter is-capitalized"
                  :class="{
                    'has-text-white': sortBy === header,
                  }"
                  @click="sort()"
                >
                  {{ header }}
                  <i
                    class="fas fa-angle-down"
                    v-if="sortBy === header && !reversedSort"
                    style="margin-left: 10px;"
                  ></i>
                  <i
                    class="fas fa-angle-up"
                    v-else-if="sortBy === header && reversedSort"
                    style="margin-left: 10px;"
                  ></i>
                </a>
              </th>
              <th></th>
            </thead>
            <tfoot v-if="filteredRacks.length > 10">
              <th v-for="header in headers" :key="header">
                <span class="is-capitalized">{{ header }}</span>
              </th>
              <th></th>
            </tfoot>
            <tbody>
              <tr
                class="row"
                v-for="rack in filteredRacks"
                :key="rack.id"
                @click="
                  $router.push({
                    name: 'build-devices',
                    params: { id: currentBuild.id },
                    query: { rackId: rack.id },
                  })
                "
                :style="{
                  cursor: userIsAdmin ? 'pointer' : 'default',
                }"
              >
                <td class="name">
                  <span>{{ rack.name }}</span>
                </td>
                <td class="rack-role-name">
                  <span>{{ rack.rack_role_name }}</span>
                </td>
                <td class="datacenterRoom">
                  <span>
                    {{ rack.datacenter_room_alias }}
                  </span>
                </td>
                <td class="phase">{{ rack.phase }}</td>
                <td class="remove-item has-text-right">
                  <i
                    class="fas fa-trash-alt"
                    @click="showRemoveItemModal(rack)"
                  ></i>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="no-results" v-else>
            <p class="subtitle has-text-centered">
              No Results to Display
            </p>
          </div>
        </div>
      </div>
    </div>
    <RemoveItemModal v-if="removeRack" :item="removingRack" item-type="rack" />
    <AddRackModal v-if="addingRack" />
  </div>
</template>

<script>
import search from 'fuzzysearch';
import isEmpty from 'lodash/isEmpty';
import AddRackModal from './AddRackModal.vue';
import RemoveItemModal from './RemoveItemModal.vue';
import Spinner from '../components/Spinner.vue';
import * as DatacenterRooms from '@api/datacenterRooms.js';
import { EventBus } from '@src/eventBus.js';
import { mapActions, mapState } from 'vuex';
import { getBuildRacks } from '@api/builds.js';
import { getCurrentUser } from '@api/users.js';

export default {
  components: {
    AddRackModal,
    RemoveItemModal,
    Spinner,
  },
  data() {
    return {
      addingRack: false,
      datacenterRoomAliases: [],
      datacenterRoomFilter: 'all',
      fetchingData: false,
      headers: ['name', 'role', 'datacenter room alias', 'phase'],
      phaseFilter: 'all',
      phases: [
        'installation',
        'integration',
        'production',
        'diagnostics',
        'decommissioned',
      ],
      removeRack: false,
      removingRack: {},
      searchText: '',
      sortBy: '',
    };
  },
  methods: {
    ...mapActions([
      'setCurrentBuild',
      'setCurrentBuildRacks',
      'setCurrentUser',
    ]),
    changeFilter(event, filter) {
      let phaseFilter, roomFilter;
      const eventValue = event && event.target && event.target.value;

      if (filter === 'phase') {
        phaseFilter = eventValue;
        roomFilter = this.$route.query.room;
      } else {
        phaseFilter = this.$route.query.phase;
        roomFilter = eventValue;
      }

      this.$router.push({
        name: 'build-racks',
        params: { id: this.currentBuild.id },
        query: {
          phase: phaseFilter || 'all',
          room: roomFilter || 'all',
        },
      });
    },
    closeModal() {
      this.addingRack = false;
      this.removeRack = false;
      this.removingRack = {};
    },
    async fetchData() {
      this.fetchingData = true;

      const buildId = this.$route.params.id;
      const currentBuild = this.currentBuild;
      const currentBuildRacks = this.currentBuildRacks;
      const currentUser = this.currentUser;

      if (
        !currentBuild ||
        isEmpty(currentBuild) ||
        currentBuild.id !== buildId
      ) {
        const racksResponse = await getBuildRacks(buildId);
        this.setCurrentBuildRacks(racksResponse.data);

        const userResponse = await getCurrentUser();
        this.setCurrentUser(userResponse.data);
      } else {
        if (!currentBuildRacks || currentBuildRacks.length === 0) {
          const racksResponse = await getBuildRacks(buildId);
          this.setCurrentBuildRacks(racksResponse.data);
        }

        if (!currentUser || isEmpty(currentUser)) {
          const userResponse = await getCurrentUser();
          this.setCurrentUser(userResponse.data);
        }
      }

      if (this.$route.query && this.$route.query.phase) {
        this.phaseFilter = this.$route.query.phase;
      }

      if (this.$route.query && this.$route.query.room) {
        this.datacenterRoomFilter = this.$route.query.room;
      }

      this.datacenterRoomAliases = this.currentBuildRacks.map(
        rack => rack.datacenter_room_alias
      );

      this.fetchingData = false;
    },
    selectRack(rack) {
      this.$emit('rack-selected', { rack });
    },
    async navigateToRack(rack) {
      const response = await DatacenterRooms.getDatacenterRoom(
        rack.datacenter_room_id
      );

      if (response && response.data && response.data.az) {
        this.$router.push({
          name: 'datacenterRack',
          params: {
            rackId: rack.id,
            roomName: response.data.az,
          },
        });
      }
    },
    showAddRackModal() {
      this.addingRack = true;
    },
    showRemoveItemModal(rack) {
      this.removingRack = rack;
      this.removeRack = true;
    },
    refetchCurrentBuildRacks() {
      getBuildRacks(this.currentBuild.id).then(response => {
        this.setCurrentBuildRacks(response.data);
      });
    },
  },
  computed: {
    ...mapState(['currentBuild', 'currentBuildRacks', 'currentUser']),
    availableDatacenterRooms() {
      if (!this.currentBuildRacks.length) {
        return [];
      }

      let rooms = [];

      this.datacenterRoomAliases.forEach(room => {
        if (rooms.includes(room) === false) {
          rooms.push(room);
        }
      });

      return rooms;
    },
    filteredRacks() {
      if (!this.currentBuildRacks.length) {
        return [];
      }

      let racks = this.currentBuildRacks;

      if (this.searchText) {
        const searchText = this.searchText.toLowerCase();

        racks = racks.reduce((acc, rack) => {
          const name = rack.name.toLowerCase();
          const role = rack.rack_role_name.toLowerCase();
          const datacenterRoomAlias = rack.datacenter_room_alias.toLowerCase();
          const phase = rack.phase.toLowerCase();

          if (
            (name && search(searchText, name)) ||
            (role && search(searchText, role)) ||
            (datacenterRoomAlias && search(searchText, datacenterRoomAlias)) ||
            (phase && search(searchText, phase))
          ) {
            acc.push(rack);
          }

          return acc;
        }, []);
      }

      if (this.phaseFilter !== 'all') {
        racks = racks.filter(rack => {
          return rack.phase === this.phaseFilter.toLowerCase();
        });
      }

      if (this.datacenterRoomFilter !== 'all') {
        racks = racks.filter(
          rack => rack.datacenter_room_alias === this.datacenterRoomFilter
        );
      }

      return racks;
    },
    userIsAdmin() {
      const user = this.currentUser;

      if (user && user.is_admin) {
        return true;
      }

      if (user && user.builds && user.builds.length) {
        const build = user.builds.find(
          build => build.id === this.currentBuild.id
        );

        if (build && build.role === 'admin') {
          return true;
        }
      }

      return false;
    },
  },
  created() {
    this.fetchData();

    EventBus.$on(
      [
        'close-modal:add-item',
        'close-modal:remove-item',
        'close-modal:success-modal',
      ],
      () => {
        this.closeModal();
      }
    );

    EventBus.$on('rack-added', () => {
      this.refetchCurrentBuildRacks();
    });
  },
};
</script>
