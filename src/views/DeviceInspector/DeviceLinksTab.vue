<template>
  <section class="links-tab">
    <div class="columns">
      <div class="column">
        <div class="is-paddingless">
          <div
            class="datatable-header"
            :style="{
              'border-bottom': deviceLinks ? '1px solid #4e5d6c' : 'none',
              'border-bottom-left-radius': deviceLinks ? '0' : '4px',
              'border-bottom-right-radius': deviceLinks ? '0' : '4px',
            }"
          >
            <span class="heading is-size-6 is-marginless">
              {{ `Links (${deviceLinks && deviceLinks.length})` }}
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
            <i
              v-if="deviceLinks && deviceLinks > 1"
              class="material-icons has-text-danger"
              @click="showConfirmationModal = true"
            >
              delete
            </i>
            <i
              class="material-icons has-text-success"
              @click="showAddLinkModal = true"
            >
              add_circle
            </i>
          </div>
          <table v-if="deviceLinks" class="table is-hoverable is-fullwidth">
            <tbody>
              <tr
                class="row"
                v-for="(item, index) in filteredLinks"
                :key="index"
              >
                <td class="link">
                  <span>{{ item }}</span>
                </td>
                <td class="has-text-right">
                  <a @click.stop="showDeleteLinkModal(item)">
                    <span class="icon material-icons">delete</span>
                  </a>
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
    <confirmation-modal
      v-if="showConfirmationModal"
      @close-modal="closeConfirmationModal()"
      @action-confirmed="removeDeviceLinks()"
      :link="link"
    ></confirmation-modal>
    <add-link-modal
      v-if="showAddLinkModal"
      @close-modal="showAddLinkModal = false"
      @action-confirmed="addLink"
    ></add-link-modal>
  </section>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import {
  addDeviceLinks,
  getDeviceDetails,
  removeDeviceLinks,
} from '@api/devices.js';

import search from 'fuzzysearch';
import AddLinkModal from '@src/views/components/AddLinkModal.vue';
import ConfirmationModal from '@src/views/components/ConfirmationModal.vue';

export default {
  components: {
    AddLinkModal,
    ConfirmationModal,
  },
  data() {
    return {
      link: '',
      links: [],
      searchText: '',
      showAddLinkModal: false,
      showConfirmationModal: false,
    };
  },
  computed: {
    ...mapState(['activeDeviceDetails']),
    deviceLinks() {
      return (
        this.activeDeviceDetails &&
        this.activeDeviceDetails.links &&
        this.activeDeviceDetails.links.length
      );
    },
    filteredLinks() {
      let links = this.links;

      if (this.searchText) {
        const searchText = this.searchText.toLowerCase();

        links = links.reduce((acc, link) => {
          const linkText = link.toLowerCase();

          if (search(searchText, linkText)) {
            acc.push(link);
          }

          return acc;
        }, []);
      }

      return links;
    },
  },
  methods: {
    ...mapActions(['setActiveDeviceDetails']),
    async addLink(data) {
      this.isLoadingAddLinks = true;

      try {
        await addDeviceLinks(this.activeDeviceDetails.id, [data.link]);
        await this.refetchDevice();
        this.$toasted.success('Link added successfully', {
          icon: 'check',
        });
      } catch (error) {
        this.showErrorMessage(error);
      }
    },
    closeConfirmationModal() {
      this.showConfirmationModal = false;
      this.link = '';
    },
    async refetchDevice() {
      const response = await getDeviceDetails(this.activeDeviceDetails.id);
      const deviceDetails = response.data;
      this.setActiveDeviceDetails(deviceDetails);
      this.links = deviceDetails.links;
    },
    async removeDeviceLinks() {
      let data = null;

      if (this.link) {
        data = {
          links: [this.link],
        };
      }

      try {
        await removeDeviceLinks(this.activeDeviceDetails.id, data);
        await this.refetchDevice();
        this.$toasted.success(
          `${this.link ? 'Link' : 'Links'} removed successfully`,
          { icon: 'check' }
        );
      } catch (error) {
        this.showErrorMessage(error);
      }
    },
    showDeleteLinkModal(link) {
      this.link = link;
      this.showConfirmationModal = true;
    },
    showErrorMessage(error) {
      let errorMessage;

      if (error.response && error.response.data && error.response.data.error) {
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
    },
  },
  mounted() {
    this.links = this.activeDeviceDetails.links;
  },
};
</script>
