<template>
  <div class="password-reset-page hero is-dark is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns">
          <div class="column is-4 is-offset-4 password-message">
            <article class="message is-danger">
              <div class="message-header">
                <i class="material-icons">error</i>
                <span>
                  Password Update Required
                </span>
              </div>
              <div class="message-body">
                Your password needs to be updated immediately.
              </div>
            </article>
          </div>
        </div>
        <div class="columns">
          <div class="column is-4 is-offset-4 box">
            <transition name="fade">
              <article
                class="message error is-danger"
                v-if="
                  showError &&
                    (errors.passwordLength || errors.passwordMismatch)
                "
              >
                <div class="message-header">
                  <i class="material-icons">error</i>
                  <p>
                    <span v-if="errors.passwordLength">
                      Passwords must contain at least 12 characters.
                    </span>
                    <span v-if="errors.passwordMismatch">
                      The passwords you entered do not match.
                    </span>
                  </p>
                </div>
              </article>
            </transition>
            <p class="title has-text-weight-bold is-4">
              Reset Password
            </p>
            <form>
              <div class="field">
                <label class="label">New Password</label>
                <div class="control has-icons-right">
                  <input
                    class="input password"
                    :class="{
                      'is-danger': errors.passwordLength,
                      'is-success': validPassword,
                    }"
                    type="password"
                    placeholder="New Password"
                    v-model="password"
                    ref="passwordInput"
                    @blur="validatePassword()"
                  />
                  <span
                    class="icon is-small is-right has-text-danger"
                    v-if="errors.passwordLength"
                  >
                    <i class="material-icons">error</i>
                  </span>
                  <span
                    class="icon is-small is-right has-text-success"
                    v-if="validPassword"
                  >
                    <i class="fas fa-check"></i>
                  </span>
                </div>
              </div>
              <div class="field">
                <label class="label">Confirm Password</label>
                <div class="control has-icons-right">
                  <input
                    class="input confirmation"
                    :class="{
                      'is-danger': errors.passwordMismatch,
                      'is-success': validConfirmPassword,
                    }"
                    type="password"
                    placeholder="Confirm Password"
                    v-model="confirmPassword"
                    ref="confirmPassword"
                    @blur="validateConfirmPassword()"
                  />
                  <span
                    class="icon is-small is-right has-text-danger"
                    v-if="errors.passwordMismatch"
                  >
                    <i class="material-icons">error</i>
                  </span>
                  <span
                    class="icon is-small is-right has-text-success"
                    v-if="validConfirmPassword"
                  >
                    <i class="fas fa-check"></i>
                  </span>
                </div>
              </div>
              <a
                class="button save is-primary is-fullwidth"
                :class="{ 'is-loading': isLoading }"
                :disabled="isLoading"
                @click="savePassword()"
                type="button"
              >
                Update Password
              </a>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { updatePassword } from '@api/users.js';

export default {
  data() {
    return {
      confirmPassword: '',
      errors: {},
      isLoading: false,
      password: '',
      showError: false,
      validConfirmPassword: false,
      validPassword: false,
    };
  },
  methods: {
    ...mapActions(['clearForcePasswordChange']),
    focusPasswordInput() {
      this.$refs.passwordInput.focus();
    },
    resetErrors() {
      this.errors = {};
    },
    savePassword() {
      this.isLoading = true;
      const password = this.password;
      const confirmPassword = this.confirmPassword;
      this.resetErrors();

      if (!password || password.length < 5) {
        this.errors.passwordLength = true;
        this.isLoading = false;
        this.showError = true;
        return;
      }

      if (!confirmPassword || password !== confirmPassword) {
        this.errors.passwordMismatch = true;
        this.isLoading = false;
        this.showError = true;
        return;
      } else {
        updatePassword(password).then(() => {
          this.$router.push({ name: 'signIn' });
          this.isLoading = false;
        });
      }
    },
    validateConfirmPassword() {
      this.validConfirmPassword = false;
      const confirmPassword = this.confirmPassword;

      if (!confirmPassword && !this.password) {
        this.errors.passwordMismatch = false;
      } else if (confirmPassword && confirmPassword === this.password) {
        this.validConfirmPassword = true;
        this.errors.passwordMismatch = false;
      } else {
        this.errors.passwordMismatch = true;
      }
    },
    validatePassword() {
      this.resetErrors();
      this.showError = false;
      this.validPassword = false;
      const password = this.password;

      if (password && password.length >= 12) {
        this.validPassword = true;
      }

      if (this.confirmPassword) {
        this.validateConfirmPassword();
      }
    },
  },
  mounted() {
    this.focusPasswordInput();
    this.clearForcePasswordChange();
  },
};
</script>
