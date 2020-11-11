<template>
  <div class="modal add-link-modal" :class="{ 'is-active': isActive }">
    <div class="modal-background" @click="closeModal()"></div>
    <div class="modal-content">
      <div class="notification">
        <div class="modal-heading">
          <span class="modal-title">Add Link</span>
          <i class="material-icons close" @click="closeModal()">
            close
          </i>
        </div>
        <validation-observer v-slot="{ invalid }">
          <div class="modal-body">
            <div class="control has-icons-left">
              <validation-provider
                mode="eager"
                name="Link"
                rules="is"
                v-slot="{ errors }"
              >
                <input
                  type="text"
                  class="input"
                  v-model="link"
                  placeholder="Link"
                  @keyup.enter="invalid ? null : confirmAction()"
                  ref="link"
                />
                <span class="icon is-left">
                  <span class="material-icons">link</span>
                </span>
                <p
                  class="has-text-danger"
                  style="margin-top: 6px; font-size: 14px"
                  >{{ errors[0] }}</p
                >
              </validation-provider>
            </div>
          </div>
          <div class="modal-footer">
            <a
              class="button cancel is-dark"
              :class="{ 'is-loading': isLoading }"
              @click="closeModal()"
            >
              Cancel
            </a>
            <a
              class="button add is-success"
              :class="{ 'is-loading': isLoading }"
              :disabled="invalid"
              @click="invalid ? null : confirmAction()"
            >
              Add Link
            </a>
          </div>
        </validation-observer>
      </div>
    </div>
  </div>
</template>

<script>
import isUrl from 'is-url';
import { extend, ValidationProvider, ValidationObserver } from 'vee-validate';

extend('is', {
  validate: value => {
    return isUrl(value);
  },
  message: 'Input must be a valid URL',
});

export default {
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      isActive: true,
      isLoading: false,
      link: '',
    };
  },
  methods: {
    closeModal() {
      this.$emit('close-modal');
      this.isActive = false;
    },
    confirmAction() {
      this.isLoading = true;
      this.$emit('action-confirmed', { link: this.link });
      this.closeModal();
    },
    focusTokenNameInput() {
      this.$refs.link.focus();
    },
  },
  mounted() {
    this.focusTokenNameInput();
  },
};
</script>
