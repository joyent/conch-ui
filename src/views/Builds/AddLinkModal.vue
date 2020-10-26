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
        <div class="modal-body">
          <div class="control has-icons-left">
            <input
              type="text"
              class="input"
              v-model="link"
              placeholder="Link"
              @keyup.enter="confirmAction()"
              ref="link"
            />
            <span class="icon is-left">
              <span class="material-icons">link</span>
            </span>
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
            @click="confirmAction()"
          >
            Add Link
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
