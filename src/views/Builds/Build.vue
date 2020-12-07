<template>
  <div class="build">
    <div class="build-header">
      <p class="build-name title has-text-white">
        {{ currentBuild.name }}
      </p>
      <div class="field is-grouped">
        <p class="control">
          <a class="button is-dark" @click="$router.push({ name: 'builds' })">
            <span class="icon">
              <i class="material-icons">arrow_back</i>
            </span>
            <strong>Back To Builds</strong>
          </a>
        </p>
        <p class="control" v-if="!currentBuild.started">
          <a class="button is-success" @click="updateBuild('start')">
            Start Build
          </a>
        </p>
        <p
          v-if="currentBuild.started && !currentBuild.completed"
          class="control"
        >
          <a
            v-if="userIsAdmin"
            class="button is-success"
            @click="updateBuild('complete')"
          >
            Complete Build
          </a>
        </p>
      </div>
    </div>
    <div class="tabs is-toggle">
      <ul>
        <li
          :class="{ 'is-active': $route.name === `build-${tab.key}` }"
          v-for="tab in tabs"
          :key="tab.name"
        >
          <router-link
            :to="{
              name: `build-${tab.key}`,
              params: { id: currentBuild.id },
            }"
            class="tab is-uppercase"
            tag="a"
          >
            {{ tab.name }}
          </router-link>
        </li>
      </ul>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty';
import { mapActions, mapState } from 'vuex';
import { getBuild, updateBuild } from '@api/builds.js';

export default {
  data() {
    return {
      action: '',
    };
  },
  methods: {
    ...mapActions(['setCurrentBuild']),
    async fetchData() {
      const currentBuild = this.currentBuild;

      if (
        this.$route.params &&
        this.$route.params.id &&
        ((currentBuild && currentBuild.id !== this.$route.params.id) ||
          isEmpty(currentBuild))
      ) {
        const buildResponse = await getBuild(this.$route.params.id);
        this.setCurrentBuild(buildResponse.data);
        localStorage.setItem('mostRecentBuildId', this.$route.params.id);
      }
    },
    async updateBuild(action) {
      const buildId = this.currentBuild.id;
      const now = new Date();
      let data;

      if (action === 'complete') {
        this.action = 'completed';
        data = { completed: now };
      } else if (action === 'start') {
        this.action = 'started';
        data = { started: now };
      }

      try {
        await updateBuild(buildId, data);
        this.$toasted.success('Build updated successfully');

        await getBuild(buildId);
        this.setCurrentBuild(buildId);
      } catch (error) {
        let errorMessage;

        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          errorMessage = `Error: ${error.response.data.error}`;
        } else {
          errorMessage = 'An error occurred';
        }

        this.$toasted.error(errorMessage, {
          action: [
            {
              icon: 'close',
              onClick: (e, toastObject) => {
                toastObject.goAway(0);
              },
            },
          ],
          duration: 8000,
          icon: 'error',
        });
      }
    },
  },
  computed: {
    ...mapState(['currentBuild', 'currentUser']),
    tabs() {
      let tabs = [
        {
          key: 'overview',
          component: 'OverviewTab',
          name: 'Overview',
        },
        {
          key: 'racks',
          component: 'RacksTab',
          name: 'Racks',
        },
        {
          key: 'devices',
          component: 'DevicesTab',
          name: 'Devices',
        },
      ];
      const adminTabs = [
        {
          key: 'members',
          component: 'MembersTab',
          name: 'Members',
        },
        {
          key: 'organizations',
          component: 'OrganizationsTab',
          name: 'Organizations',
        },
      ];

      tabs = this.userIsAdmin ? tabs.concat(adminTabs) : tabs;
      tabs.push({
        key: 'links',
        component: 'LinksTab',
        name: 'Links',
      });

      return tabs;
    },
    userIsAdmin() {
      const build = this.currentBuild;
      const user = this.currentUser;

      if (
        (user && user.is_admin) ||
        (build &&
          build.admins &&
          build.admins.length &&
          build.admins.map(admin => admin.id).includes(user.id))
      ) {
        return true;
      }

      return false;
    },
  },
  created() {
    this.fetchData();
  },
};
</script>
