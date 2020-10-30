<template>
  <spinner v-if="fetchingData"></spinner>
  <section v-else class="data-centers">
    <div
      class="page-heading"
      style="display: flex; align-items: center; margin-bottom: 20px"
    >
      <span class="icon material-icons">business</span>
      <h1 class="title is-4 has-text-weight-bold" style="margin-left: 8px;">
        Data Centers
      </h1>
    </div>
    <div style="display: flex">
      <div
        class="control has-icons-left"
        style="margin-bottom: 20px; flex-grow: 1"
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
    </div>
    <div class="cards grid-view" v-if="filteredDcs && filteredDcs.length">
      <div class="card" v-for="dc in filteredDcs" :key="dc.id">
        <router-link
          :to="{ name: 'datacenter', params: { id: dc.id } }"
          style="display: flex; flex-direction: column; height: 100%;"
        >
          <div class="card-content" style="flex-grow: 1;">
            <p class="name is-uppercase">{{ dc.region }}</p>
            <p class="dc-location" style="margin-bottom: 10px;">
              <span class="material-icons" style="margin-right: 8px;"
                >place</span
              >
              <span>{{ dc.location }}</span>
            </p>
            <p class="dc-vendor">
              <span class="material-icons" style="margin-right: 8px;"
                >corporate_fare</span
              >
              <span>{{ dc.vendor }}</span>
            </p>
          </div>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script>
import search from 'fuzzysearch';
import Spinner from '../components/Spinner.vue';
import { mapActions, mapState } from 'vuex';
import { getDataCenters } from '@api/dataCenters.js';

export default {
  components: {
    Spinner,
  },
  data() {
    return {
      fetchingData: true,
      searchText: '',
    };
  },
  methods: {
    ...mapActions(['setDataCenters']),
    async fetchData() {
      const dataCenters = this.dataCenters;

      if (!dataCenters || (dataCenters && dataCenters.length === 0)) {
        const dataCentersResponse = await getDataCenters();
        this.setDataCenters(dataCentersResponse.data);
      }

      this.fetchingData = false;
    },
  },
  computed: {
    ...mapState(['dataCenters']),
    filteredDcs() {
      let dataCenters = this.dataCenters;

      if (this.searchText) {
        const searchText = this.searchText.toLowerCase();
        dataCenters = dataCenters.reduce((acc, dc) => {
          const region = dc.region.toLowerCase();
          const location = dc.location.toLowerCase();
          const vendor = dc.vendor.toLowerCase();

          if (
            search(searchText, region) ||
            search(searchText, location) ||
            search(searchText, vendor)
          ) {
            acc.push(dc);
          }

          return acc;
        }, []);
      }

      return dataCenters;
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>
