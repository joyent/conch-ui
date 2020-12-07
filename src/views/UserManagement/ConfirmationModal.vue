<template>
  <div class="remove-item-modal" v-if="isActive">
    <div class="modal is-active">
      <div class="modal-background" @click="closeModal()"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Confirm Action</p>
          <i class="material-icons close" @click="closeModal()">
            close
          </i>
        </header>
        <section class="modal-card-body">
          <p style="margin: 16px 0 20px;">{{ message }}</p>
          <div
            v-if="itemType === 'user'"
            class="field has-switch"
            style="margin-bottom: 20px; display: flex; justify-content: center;"
          >
            <p style="margin: 0 12px 10px 0;">
              Clear this user's tokens:
            </p>
            <label class="switch">
              <input
                type="checkbox"
                :checked="clearTokens"
                v-model="clearTokens"
                :true-value="true"
                :false-value="false"
              />
              <span class="slider round is-success"></span>
            </label>
            <p class="switch-text" style="margin: 0 12px 0;">
              <strong v-if="clearTokens">Yes</strong>
              <strong v-else>No</strong>
            </p>
          </div>
          <div class="buttons-group">
            <a class="button cancel" @click="closeModal()">
              Cancel
            </a>
            <a
              class="button is-danger confirm"
              :class="{ 'is-loading': isLoading }"
              @click="confirmAction()"
            >
              Confirm
            </a>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true,
    },
    itemType: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      clearTokens: false,
      isActive: true,
      isLoading: false,
    };
  },
  methods: {
    closeModal() {
      this.$emit('close-modal', { clearTokens: this.clearTokens });
      this.isActive = false;
    },
    confirmAction() {
      this.isLoading = true;
      this.$emit('confirm-action');
      this.closeModal();
    },
  },
};
</script>
