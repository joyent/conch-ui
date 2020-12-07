<template>
  <section class="links-tab">
    <div class="columns">
      <div class="column">
        <div class="is-paddingless">
          <div
            class="datatable-header"
            :style="{
              'border-bottom': buildLinks ? '1px solid #4e5d6c' : 'none',
              'border-bottom-left-radius': buildLinks ? '0' : '4px',
              'border-bottom-right-radius': buildLinks ? '0' : '4px',
            }"
          >
            <span class="heading is-size-6 is-marginless">
              {{ `Links (${filteredLinks && filteredLinks.length})` }}
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
            <template v-if="userIsAdmin">
              <i
                v-if="buildLinks && buildLinks > 1"
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
            </template>
          </div>
          <table v-if="buildLinks" class="table is-hoverable is-fullwidth">
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
      @action-confirmed="executeAction"
      :link="link"
    ></confirmation-modal>
    <add-link-modal
      v-if="showAddLinkModal"
      @close-modal="showAddLinkModal = false"
      @action-confirmed="addLinkToBuild"
    ></add-link-modal>
  </section>
</template>

<script>
import search from 'fuzzysearch';
import AddLinkModal from '@src/views/components/AddLinkModal.vue';
import ConfirmationModal from '@src/views/components/ConfirmationModal.vue';
import { mapActions, mapState } from 'vuex';
import {
  addLinkToBuild,
  getBuild,
  removeAllLinksFromBuild,
  removeLinkFromBuild,
} from '@api/builds.js';

export default {
  components: {
    AddLinkModal,
    ConfirmationModal,
  },
  data() {
    return {
      link: '',
      searchText: '',
      showAddLinkModal: false,
      showConfirmationModal: false,
    };
  },
  methods: {
    ...mapActions(['setCurrentBuild']),
    async addLinkToBuild(data) {
      const buildId = this.currentBuild.id;

      try {
        await addLinkToBuild(buildId, [data.link]);
        this.showSuccessMessage('Link added successfully');
        this.refetchBuild();
      } catch (error) {
        this.showErrorMessage(error);
      }
    },
    closeConfirmationModal() {
      this.showConfirmationModal = false;
      this.link = '';
    },
    async executeAction() {
      try {
        if (this.link) {
          await removeLinkFromBuild(this.currentBuild.id, [this.link]);
          this.showSuccessMessage('Link removed successfully');
        } else {
          await removeAllLinksFromBuild(this.currentBuild.id);
          this.showSuccessMessage('Links removed successfully');
        }

        this.refetchBuild();
      } catch (error) {
        this.showErrorMessage(error);
      }
    },
    async refetchBuild() {
      const buildResponse = await getBuild(this.currentBuild.id);
      this.setCurrentBuild(buildResponse.data);
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
    showSuccessMessage(msg) {
      this.$toasted.success(msg, {
        action: [
          {
            icon: 'close',
            onClick: (e, toastObject) => {
              toastObject.goAway(0);
            },
          },
        ],
        duration: 4000,
        icon: 'check',
      });
    },
  },
  computed: {
    ...mapState(['currentBuild', 'currentUser']),
    buildLinks() {
      return (
        this.currentBuild &&
        this.currentBuild.links &&
        this.currentBuild.links.length
      );
    },
    filteredLinks() {
      let links = this.currentBuild.links;

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
};
</script>
