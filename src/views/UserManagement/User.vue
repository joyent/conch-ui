<template>
  <spinner v-if="!user.id"></spinner>
  <section class="user" v-else>
    <nav
      class="navbar"
      style="margin: -20px -20px 20px -20px; position: sticky; top: -1px"
    >
      <div class="navbar-brand">
        <div class="navbar-item">
          <span class="icon material-icons">account_circle</span>
          <h1 class="title is-4 has-text-weight-bold" style="margin-left: 8px">
            {{ user.name }}
          </h1>
        </div>
      </div>
      <div class="navbar-menu">
        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <a
                class="button is-info"
                v-if="!isEditUser"
                @click="isEditUser = true"
                style="min-width: 96px"
              >
                <strong>Edit</strong>
              </a>
              <a
                v-if="isEditUser"
                class="button is-dark"
                @click="isEditUser = false"
              >
                <span class="icon">
                  <i class="material-icons">arrow_back</i>
                </span>
                <strong>Back</strong>
              </a>
              <a class="button is-info" @click="createTokenModal = true">
                <strong>Create Token</strong>
              </a>
              <a
                v-if="currentUser.id !== $route.params.id"
                class="button is-danger"
                @click="showConfirmationModal('user')"
              >
                Deactivate
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <div class="columns" v-if="errorMessage">
      <div class="column is-6 is-offset-3">
        <article class="message is-danger">
          <div class="message-header">
            <p class="">Error: {{ errorMessage }}</p>
            <button
              class="delete"
              aria-label="delete"
              @click="errorMessage = ''"
            ></button>
          </div>
        </article>
      </div>
    </div>
    <edit-user v-if="isEditUser" :user="user" @set-user="setUser"></edit-user>
    <div v-else class="columns">
      <div class="column is-narrow">
        <div class="card" style="border-radius: 4px">
          <div class="card-content">
            <form>
              <div class="field" v-for="field in fields" :key="field.key">
                <label class="label">
                  {{ field.text }}
                  <span v-if="isValueModified(field)" class="has-text-success"
                    >(modified)</span
                  >
                </label>
                <div class="control">
                  <input
                    v-if="field.type === 'datetime' || field.type === 'uuid'"
                    class="input"
                    type="text"
                    readonly
                    :value="
                      field.type === 'datetime'
                        ? getFormattedDate(field.value)
                        : field.value
                    "
                  />
                  <input
                    v-else
                    class="input"
                    type="text"
                    v-model="field.value"
                    readonly
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="card" style="border-radius: 4px">
          <div class="card-content">
            <div class="tabs">
              <ul>
                <li
                  :class="{
                    'is-active': activeTab === tab,
                  }"
                  v-for="(tab, index) in tabs"
                  :key="index"
                  @click="activeTab = tab"
                >
                  <a class="is-capitalized">{{ tab }}</a>
                </li>
              </ul>
            </div>
            <table class="table is-fullwidth" v-if="activeTab !== 'tokens'">
              <thead v-if="tableItems && tableItems.length">
                <tr>
                  <th
                    v-for="(header, index) in tableHeaders"
                    :key="index"
                    class="is-capitalized"
                    >{{ header }}</th
                  >
                </tr>
              </thead>
              <tfoot
                v-if="tableItems && tableItems.length && tableItems.length > 18"
              >
                <tr>
                  <th
                    v-for="(header, index) in tableHeaders"
                    :key="index"
                    class="is-capitalized"
                    >{{ header }}</th
                  >
                </tr>
              </tfoot>
              <tbody v-if="tableItems && tableItems.length">
                <tr
                  v-for="item in tableItems"
                  :key="item.id"
                  @click="navigateToItem(item.id)"
                  style="cursor: pointer"
                >
                  <td>{{ item.name }}</td>
                  <td>{{ item.description }}</td>
                  <td>{{ item.role }}</td>
                  <td>{{ item.id }}</td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td> No {{ activeTab }} to display. </td>
                </tr>
              </tbody>
            </table>
            <table v-else class="table is-fullwidth is-hoverable">
              <thead v-if="tokens && tokens.length">
                <tr>
                  <th>Name</th>
                  <th>Last Used</th>
                  <th>Last IP Address</th>
                  <th>Created</th>
                  <th>Expires</th>
                  <th></th>
                </tr>
              </thead>
              <tfoot>
                <tr v-if="tokens && tokens.length && tokens.length > 20">
                  <th>Name</th>
                  <th>Last Used</th>
                  <th>Last IP Address</th>
                  <th>Created</th>
                  <th>Expires</th>
                  <th></th>
                </tr>
              </tfoot>
              <spinner v-if="loadingTokens"></spinner>
              <tbody v-else-if="tokens && tokens.length">
                <tr v-for="(token, index) in tokens" :key="index">
                  <td>{{ token.name }}</td>
                  <td>{{ getFormattedDate(token.last_used) }}</td>
                  <td>{{ token.last_ipaddr || 'None' }}</td>
                  <td>{{ getFormattedDate(token.created) }}</td>
                  <td>{{ getFormattedDate(token.expires) }}</td>
                  <td>
                    <span
                      class="icon"
                      @click="showConfirmationModal('token', token.name)"
                      style="cursor: pointer"
                    >
                      <i class="material-icons">delete</i>
                    </span>
                  </td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td> No tokens to display. </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <create-token-modal
      v-if="createTokenModal"
      @close-modal="createTokenModal = false"
      @create-token="getTokens"
    ></create-token-modal>
    <confirmation-modal
      v-if="showConfirmationModalDialog"
      :item-type="actionItem"
      :message="confirmationMessage"
      @close-modal="showConfirmationModalDialog = false"
      @confirm-action="executeAction"
    ></confirmation-modal>
  </section>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import moment from 'moment';
import Spinner from '@src/views/components/Spinner.vue';
import { mapState } from 'vuex';
import { deactivateUser, getUser, getUserTokens } from '@api/users.js';
import { deleteToken } from '@api/users.js';
import EditUser from '../UserManagement/EditUser.vue';
import CreateTokenModal from '../UserManagement/CreateTokenModal.vue';
import ConfirmationModal from '../UserManagement/ConfirmationModal.vue';

export default {
  components: {
    ConfirmationModal,
    CreateTokenModal,
    EditUser,
    Spinner,
  },
  data() {
    return {
      activeTab: 'builds',
      actionItem: '',
      builds: [],
      confirmationMessage: '',
      createTokenModal: false,
      errorMessage: '',
      defaultFields: [],
      fields: [
        {
          text: 'Name',
          key: 'name',
          value: '',
          modified: false,
          type: 'string',
        },
        {
          text: 'Email',
          key: 'email',
          value: '',
          modified: false,
          type: 'string',
        },
        {
          text: 'ID',
          key: 'id',
          value: '',
          modified: false,
          type: 'uuid',
        },
        {
          text: 'Admin',
          key: 'is_admin',
          value: '',
          modified: false,
          type: 'boolean',
        },
        {
          text: 'Force Password Change',
          key: 'force_password_change',
          value: '',
          modified: false,
          type: 'boolean',
        },
        {
          text: 'Refuse Session Auth',
          key: 'refuse_session_auth',
          value: '',
          modified: false,
          type: 'boolean',
        },
        {
          text: 'Last Login',
          key: 'last_login',
          value: '',
          modified: false,
          type: 'datetime',
        },
        {
          text: 'Last Seen',
          key: 'last_seen',
          value: '',
          modified: false,
          type: 'datetime',
        },
        {
          text: 'Created',
          key: 'created',
          value: '',
          modified: false,
          type: 'datetime',
        },
      ],
      isEditUser: false,
      isLoading: false,
      loadingTokens: false,
      organizations: [],
      showConfirmationModalDialog: false,
      tableHeaders: ['name', 'description', 'role', 'ID'],
      tabs: ['builds', 'organizations', 'tokens'],
      tokenName: '',
      tokens: [],
      user: {},
    };
  },
  async mounted() {
    this.loadingTokens = true;
    const currentUser = this.currentUser;

    if (currentUser) {
      if (currentUser.is_admin) {
        await this.getUser();
        await this.getTokens();
      } else if (this.$route.params && this.$route.params.id) {
        this.user = currentUser;
        this.builds = currentUser.builds;
        this.organizations = currentUser.organizations;
        this.setFields(currentUser);
      }
    }

    this.loadingTokens = false;
  },
  computed: {
    ...mapState(['currentUser']),
    tableItems() {
      return this.activeTab === 'builds' ? this.builds : this.organizations;
    },
  },
  methods: {
    async deactivateUser(clearTokens) {
      await deactivateUser(this.$route.params.id, {
        clear_tokens: clearTokens === true ? 'all' : 'none',
      });
    },
    async deleteToken() {
      this.isLoading = true;

      try {
        await deleteToken(this.tokenName);
        await this.getTokens();
        this.loading = false;
      } catch (error) {
        this.setError(error);
      }
    },
    executeAction() {
      const actionItem = this.actionItem;

      if (actionItem === 'token') {
        this.deleteToken();
      } else if (actionItem === 'user') {
        this.deactivateUser();
      }
    },
    getFormattedDate(date) {
      if (date) {
        return moment.utc(date).format('YYYY-MM-DD HH:mm:ss');
      } else {
        return 'None';
      }
    },
    async getTokens() {
      let response;

      try {
        response = await getUserTokens(this.user.id);
        this.tokens = response.data;
      } catch (error) {
        this.setError(error);
      }
    },
    async getUser() {
      let response;
      const userId = this.$route.params && this.$route.params.id;

      try {
        response = await getUser(userId);
        const user = response.data;
        this.user = user;
        this.builds = user.builds;
        this.organizations = user.organizations;
        this.setFields(user);
      } catch (error) {
        this.setError(error);
      }
    },
    isValueModified(formField) {
      const { key, value } = formField;
      const field = this.user[key];
      let isModified;

      if (!value) {
        return false;
      }

      if (typeof field === 'number') {
        isModified = field.toString() !== value.toString();
      } else {
        isModified = field !== value;
      }

      for (let i = 0; i < this.fields.length; i++) {
        const field = this.fields[i];

        if (field.key === key) {
          this.fields[i].modified = isModified;
          break;
        }
      }

      return isModified;
    },
    navigateToItem(itemId) {
      const tab = this.activeTab;
      const routeName = tab === 'builds' ? 'build' : 'organization';

      this.$router.push({ name: routeName, params: { id: itemId } });
    },
    setError(error) {
      this.errorMessage =
        (error && error.data && error.data.error) || 'An error occurred';
      this.editProduct = false;
      this.isLoading = false;
    },
    setFields(user) {
      const keys = Object.keys(user);

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];

        for (let j = 0; j < this.fields.length; j++) {
          const field = this.fields[j];

          if (field.key === key) {
            this.fields[j].value = user[key];
          }
        }
      }

      this.defaultFields = cloneDeep(this.fields);
    },
    setUser(data) {
      this.user = data.user;
    },
    showConfirmationModal(type, tokenName) {
      this.actionItem = type;

      if (type === 'user') {
        this.confirmationMessage =
          'Are you sure you want to deactivate this user?';
      } else if (type === 'token') {
        this.tokenName = tokenName;
        this.confirmationMessage =
          'Are you sure you want to delete this token?';
      }

      this.showConfirmationModalDialog = true;
    },
  },
};
</script>
