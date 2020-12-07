<template>
  <div class="organizations-table">
    <table class="table is-hoverable is-fullwidth" v-if="hasOrganizations">
      <thead>
        <th>Name</th>
        <th>ID</th>
        <th>Builds</th>
        <th>Created</th>
        <th v-if="currentUser.is_admin"></th>
      </thead>
      <tfoot v-if="hasOrganizations && organizations.length >= 10">
        <th>Name</th>
        <th>ID</th>
        <th>Builds</th>
        <th>Created</th>
        <th v-if="currentUser.is_admin"></th>
      </tfoot>
      <tbody>
        <tr
          class="row view-organization"
          v-for="organization in organizations"
          :key="organization.name"
          @click="
            currentUser && currentUser.is_admin
              ? $router.push({
                  name: 'organization',
                  params: { id: organization.id },
                })
              : null
          "
          :style="{
            cursor: currentUser.is_admin ? 'pointer' : 'default',
          }"
        >
          <td>{{ organization.name }}</td>
          <td>{{ organization.id }}</td>
          <td>
            {{
              (organization &&
                organization.builds &&
                organization.builds.length) ||
                0
            }}
          </td>
          <td>{{ getFormattedDate(organization.created) }}</td>
          <td v-if="currentUser.is_admin" class="has-text-right">
            <span
              v-if="currentUser && currentUser.is_admin"
              class="icon"
              @click.stop="showConfirmDeleteModal(organization)"
            >
              <i class="material-icons">delete</i>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
    <table
      class="table is-hoverable is-fullwidth"
      v-else-if="!organizations.length && !hasSearchText"
    >
      <tbody>
        <tr class="row">
          <td colspan="5"><Spinner /></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import moment from 'moment';
import { mapState } from 'vuex';
import Spinner from '@src/views/components/Spinner.vue';

export default {
  props: {
    organizations: {
      type: Array,
      required: true,
    },
    hasSearchText: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    Spinner,
  },
  methods: {
    getFormattedDate(date) {
      if (date) {
        return moment.utc(date).format('YYYY-MM-DD HH:mm:ss');
      } else {
        return 'None';
      }
    },
    showConfirmDeleteModal(organization) {
      this.$emit('delete-organization', { organization });
    },
    viewOrganizationPage(id) {
      this.$router.push({
        name: 'organization',
        params: { id },
      });
    },
  },
  computed: {
    ...mapState(['currentUser']),
    hasOrganizations() {
      return this.organizations && this.organizations.length;
    },
  },
};
</script>
