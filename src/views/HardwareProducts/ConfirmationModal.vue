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
          <p>{{ message }}</p>
          <br />
          <article class="notification">
            <i class="material-icons">warning</i>
            <p>This action cannot be undone.</p>
          </article>
          <br />
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
  },
  data() {
    return {
      isActive: true,
      isLoading: false,
    };
  },
  methods: {
    closeModal() {
      this.$emit('close-modal');
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
