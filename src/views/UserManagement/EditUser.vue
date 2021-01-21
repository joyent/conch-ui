<template>
  <section class="edit-user">
    <div class="columns" v-if="errorMessage">
      <div class="column is-12">
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
    <div class="columns" v-if="successMessage">
      <div class="column is-3 is-offset-4">
        <article class="message is-success" style="border-radius: 4px">
          <div class="message-header" style="border-radius: 4px">
            <span class="icon is-left">
              <i class="material-icons">check_circle_outline</i>
            </span>
            <p class="">{{ successMessage }}</p>
            <button
              class="delete"
              aria-label="delete"
              @click="successMessage = ''"
            ></button>
          </div>
        </article>
      </div>
    </div>
    <div class="columns">
      <div class="column is-half">
        <div class="card" style="border-radius: 4px;">
          <div class="card-content">
            <form>
              <div class="field">
                <label class="label">
                  Name
                  <span v-if="name !== user.name" class="has-text-success"
                    >(modified)</span
                  >
                </label>
                <div class="control">
                  <input v-model="name" class="input" type="text" />
                </div>
              </div>
              <div class="field">
                <label class="label">
                  Email
                  <span v-if="email !== user.email" class="has-text-success"
                    >(modified)</span
                  >
                </label>
                <div class="control">
                  <input v-model="email" class="input" type="text" />
                </div>
              </div>
              <template v-if="currentUser && currentUser.id !== user.id">
                <label class="label">
                  Is Admin
                  <span
                    v-if="isAdmin !== user.is_admin"
                    class="has-text-success"
                    >(modified)</span
                  >
                </label>
                <div class="field" style="display: flex; align-items: center;">
                  <label class="switch">
                    <input
                      type="checkbox"
                      :checked="isAdmin"
                      v-model="isAdmin"
                      :true-value="true"
                      :false-value="false"
                    />
                    <span class="slider round is-success"></span>
                  </label>
                  <span style="margin-left: 12px; width: 22px;">
                    <strong v-if="isAdmin">Yes</strong>
                    <strong v-else>No</strong>
                  </span>
                </div>
              </template>
            </form>
            <div
              class="buttons"
              style="margin-top: 20px; justify-content: flex-end;"
            >
              <a
                class="button is-dark"
                :disabled="!isUserModified"
                @click="!isLoading ? setUser() : null"
                >Cancel</a
              >
              <a
                class="button is-success"
                :class="{ 'is-loading': isLoading }"
                :disabled="!isUserModified || !hasRequiredFields"
                @click="
                  isUserModified && hasRequiredFields && !isLoading
                    ? updateUser()
                    : null
                "
                >Save Changes</a
              >
            </div>
          </div>
        </div>
      </div>
      <div class="column is-half">
        <reset-password></reset-password>
      </div>
    </div>
  </section>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import ResetPassword from '../UserManagement/ResetPassword.vue';
import { mapActions, mapState } from 'vuex';
import { updateCurrentUser, updateUser } from '@api/users.js';

export default {
  components: {
    ResetPassword,
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      email: '',
      errorMessage: '',
      isAdmin: false,
      isLoading: false,
      name: ',',
      successMessage: '',
    };
  },
  mounted() {
    this.setUser();
  },
  computed: {
    ...mapState(['currentUser']),
    hasRequiredFields() {
      return this.email && this.name ? true : false;
    },
    isUserModified() {
      const user = this.user;
      return this.email !== user.email ||
        this.name !== user.name ||
        this.isAdmin !== user.is_admin
        ? true
        : false;
    },
  },
  methods: {
    ...mapActions(['setCurrentUser']),
    async updateUser() {
      let user;

      this.isLoading = true;

      try {
        const currentUserId = this.currentUser && this.currentUser.id;
        const routeParamUserId =
          this.$route && this.$route.params && this.$route.params.id;

        if (
          currentUserId &&
          routeParamUserId &&
          currentUserId === routeParamUserId
        ) {
          const response = await updateCurrentUser(
            this.email,
            this.isAdmin,
            this.name
          );
          user = response.data;
          this.setCurrentUser(user);
        } else {
          const response = await updateUser(
            routeParamUserId,
            this.email,
            this.isAdmin,
            this.name
          );
          user = response.data;
        }

        this.email = user.email;
        this.name = user.name;
        this.isAdmin = user.is_admin;
        this.successMessage = 'User update successful';
        this.isLoading = false;
      } catch (error) {
        this.setError(error);
      }
    },
    setError(error) {
      this.errorMessage =
        (error && error.data && error.data.error) || 'An error occurred';
      this.isLoading = false;
    },
    setUser() {
      if (!isEmpty(this.user)) {
        const user = cloneDeep(this.user);
        this.name = user.name;
        this.email = user.email;
        this.isAdmin = user.is_admin;
      }
    },
  },
};
</script>
