<template>
  <Spinner v-if="builds.length < 1 && !noBuildsExist" />
  <section class="builds" v-else>
    <div class="empty-state" v-if="noBuildsExist">
      <img src="../../assets/rack.svg" width="500" />
      <template v-if="currentUser && currentUser.is_admin">
        <p class="empty-state-heading">No builds exist.</p>
        <a class="button is-info create-organization" @click="createBuild()">
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
      <h1 class="title is-4 has-text-weight-bold" style="margin-left: 8px;">
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
      <div class="select-with-label is-large">
        <label class="select-label">Status</label>
        <div class="select">
          <select
            v-model="statusFilter"
            class="is-capitalized"
            @change="setFilter($event)"
          >
            <option
              v-for="(option, index) in statusFilterOptions"
              :key="index"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
        </div>
      </div>
      <a class="button view-toggle" @click="setView()">
        <template v-if="activeView === 'grid'">
          <span class="icon">
            <i class="material-icons">reorder</i>
          </span>
          <span>Table View</span>
        </template>
        <template v-else>
          <span class="icon">
            <i class="material-icons">view_module</i>
          </span>
          <span>Grid View</span>
        </template>
      </a>
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
    <div v-if="filteredBuilds && filteredBuilds.length">
      <table v-if="activeView === 'table'" class="table is-hoverable">
        <thead>
          <tr>
            <th v-for="header in headers" :key="header">
              <a
                class="table-header-filter is-capitalized"
                :class="{
                  'has-text-white': sortHeader === header,
                }"
                @click="sort(header)"
              >
                {{ header }}
                <i
                  class="fas fa-angle-down"
                  v-if="sortHeader === header && !reversedSort"
                  style="margin-left: 10px;"
                ></i>
                <i
                  class="fas fa-angle-up"
                  v-else-if="sortHeader === header && reversedSort"
                  style="margin-left: 10px;"
                ></i>
              </a>
            </th>
          </tr>
        </thead>
        <tbody>
          <router-link
            v-for="build in filteredBuilds"
            :key="build.id"
            :to="{ name: 'build-overview', params: { id: build.id } }"
            tag="tr"
            style="cursor: pointer;"
          >
            <td>
              <p
                class="is-size-6 has-text-weight-bold"
                style="padding-bottom: 4px;"
                >{{ build.name }}</p
              >
              <p class="is-size-6" v-if="build.description">{{
                build.description
              }}</p>
              <p class="is-size-6" v-else>No Description</p>
            </td>
            <td style="vertical-align: middle">
              <span v-if="build.started">{{ getDate(build.started) }}</span>
              <span v-else>N/A</span>
            </td>
            <td style="vertical-align: middle">
              <span v-if="build.completed">{{ getDate(build.completed) }}</span>
              <span v-else>N/A</span>
            </td>
            <td style="vertical-align: middle">
              <p
                class="tag complete-status is-light is-capitalized"
                :class="{
                  'is-success': build.completed_status === 'success',
                  'is-danger': build.completed_status === 'failure',
                  'is-dark': !build.completed_status,
                }"
              >
                <span
                  v-if="build.completed_status === 'success'"
                  class="material-icons"
                  style="margin-right: 4px; font-size: 20px;"
                >
                  check_circle
                </span>
                <span
                  v-else-if="build.completed_status === 'failure'"
                  class="material-icons"
                  style="margin-right: 4px; font-size: 20px;"
                >
                  error
                </span>
                <span v-if="build.completed_status">
                  {{ build.completed_status }}
                </span>
                <span v-else>Incomplete</span>
              </p>
              <!-- <p
                v-if="build.completed_status"
                style="display: flex; align-items: center;"
              >
                <span
                  v-if="build.completed_status === 'success'"
                  class="material-icons has-text-success"
                  style="margin-right: 6px"
                >
                  check_circle
                </span>
                <span
                  v-else-if="build.completed_status === 'failure'"
                  class="material-icons has-text-danger"
                  style="margin-right: 6px"
                >
                  error
                </span>
                {{ build.completed_status }}
              </p>
              <p v-else>N/A</p> -->
            </td>
          </router-link>
        </tbody>
      </table>
      <div class="cards grid-view" v-else>
        <div class="card" v-for="build in filteredBuilds" :key="build.id">
          <router-link
            :to="{ name: 'build-overview', params: { id: build.id } }"
            style="display: flex; flex-direction: column; height: 100%;"
          >
            <div class="card-content" style="flex-grow: 1;">
              <p class="build-name">{{ build.name }}</p>
              <p style="padding-bottom: 10px; height: 60px;">{{
                build.description || 'No Description'
              }}</p>
              <div
                class="details"
                style="display: flex; align-content: center; justify-content: space-between;"
              >
                <div class="start-date">
                  <p style="color: #ced8e4; margin-bottom: 4px">
                    <strong>Started</strong>
                  </p>
                  <div>
                    <div style="display: flex; align-items: center">
                      <span class="material-icons" style="margin-right: 4px"
                        >event</span
                      >
                      <p v-if="build.started">{{ getDate(build.started) }}</p>
                      <p v-else>Not Started</p>
                    </div>
                  </div>
                </div>
                <div class="start-date">
                  <p style="color: #ced8e4; margin-bottom: 4px">
                    <strong>Completed</strong>
                  </p>
                  <div>
                    <div style="display: flex; align-items: center">
                      <span class="material-icons" style="margin-right: 4px"
                        >event_available</span
                      >
                      <p v-if="build.completed">{{
                        getDate(build.completed)
                      }}</p>
                      <p v-else>Not Started</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <footer
              class="card-footer"
              style="
              display: flex;
              align-content: center;
              justify-content: center;
              border-bottom-right-radius: 4px;
              border-bottom-left-radius: 4px;
              border-top: none;
            "
            >
              <p
                class="status has-text-weight-bold is-capitalized"
                :class="{
                  'has-text-success': build.completed_status === 'success',
                  'has-text-danger': build.completed_status === 'failure',
                }"
                style="padding: 8px; font-size: 18px;"
              >
                {{ build.completed_status || 'Incomplete' }}
              </p>
            </footer>
          </router-link>
        </div>
      </div>
    </div>
    <div v-else class="builds-empty-state">
      <span class="icon material-icons">layers</span>
      <h1 class="title is-4 has-text-weight-bold" style="margin-left: 8px;">
        No builds found
      </h1>
    </div>
    <transition name="fade">
      <CreateBuildModal v-if="creatingBuild" />
    </transition>
  </section>
</template>

<script>
import orderBy from 'lodash/orderBy';
import moment from 'moment';
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
      headers: ['Build', 'Start Date', 'Complete Date', 'Completed Status'],
      noBuildsExist: false,
      reversedSort: false,
      searchText: '',
      selectedBuild: {},
      sortHeader: '',
      statusFilter: 'started',
      statusFilterOptions: ['all', 'not started', 'started', 'completed'],
    };
  },
  methods: {
    ...mapActions(['setBuilds']),
    buildStatusClass(build) {
      if (build.completed) {
        return 'has-text-success';
      } else if (build.started) {
        return 'has-text-info';
      } else {
        return 'has-text-link';
      }
    },
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
    getDate(date) {
      return moment(date).format('YYYY/MM/DD');
    },
    graphColor(progress) {
      return progress === 100 ? this.colors.green : this.colors.blue;
    },
    isEmpty,
    selectBuild(build) {
      if (this.selectedBuild.name === build.name) {
        this.selectedBuild = {};
      } else {
        this.selectedBuild = build;
      }

      localStorage.setItem('mostRecentBuildId', build.id);
    },
    setFilter(event) {
      let status = 'all';

      if (event && event.target && event.target.value) {
        if (event.target.value === 'not started') {
          status = 'not-started';
        } else {
          status = event.target.value;
        }
      }

      this.$router.push({
        name: 'builds',
        query: { status, view: this.activeView },
      });
    },
    setView() {
      if (this.activeView === 'grid') {
        this.activeView = 'table';
      } else {
        this.activeView = 'grid';
      }

      this.$router.push({
        name: 'builds',
        query: { status: this.statusFilter, view: this.activeView },
      });
    },
    sort(header) {
      const lowerCaseHeader = header.toLowerCase();
      const sortHeader = this.sortHeader.toLowerCase();
      const reversedSort = this.reversedSort;

      if (lowerCaseHeader !== sortHeader) {
        this.sortHeader = lowerCaseHeader;
      } else if (lowerCaseHeader === sortHeader && !reversedSort) {
        this.reversedSort = true;
      } else if (lowerCaseHeader === sortHeader && reversedSort) {
        this.reversedSort = false;
      }
    },
  },
  computed: {
    ...mapState(['builds', 'currentUser']),
    filteredBuilds() {
      const searchText = this.searchText.toLowerCase();
      let builds = this.builds;

      if (this.sortHeader) {
        const sortHeader = this.sortHeader.toLowerCase();
        const reversedSort = this.reversedSort;
        let field;

        if (sortHeader === 'start date') {
          field = 'started';
        } else if (sortHeader === 'complete date') {
          field = 'completed';
        } else if (sortHeader === 'completed status') {
          field = 'completed_status';
        } else if (sortHeader === 'build') {
          field = 'name';
        }

        builds = orderBy(builds, [field], [reversedSort ? 'desc' : 'asc']);
      }

      if (searchText) {
        builds = builds.reduce((acc, build) => {
          const name = build.name.toLowerCase();

          if (search(searchText, name)) {
            acc.push(build);
          }

          return acc;
        }, []);
      }

      if (this.statusFilter !== 'all') {
        const statusFilter = this.statusFilter;

        builds = builds.filter(build => {
          if (statusFilter === 'started' && build.started && !build.completed) {
            return build;
          } else if (statusFilter === 'completed' && build.completed) {
            return build;
          } else if (
            statusFilter === 'not started' &&
            build.created &&
            !build.started
          ) {
            return build;
          }
        });
      }

      return builds;
    },
  },
  created() {
    if (!this.builds || !this.builds.length) {
      this.getBuilds();
    }

    if (this.$route.query && this.$route.query.status) {
      const routeQuery = this.$route.query;

      if (routeQuery.status === 'not-started') {
        this.statusFilter = 'not started';
      } else {
        this.statusFilter = routeQuery.status;
      }

      if (routeQuery.view) {
        this.activeView = routeQuery.view;
      }
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
