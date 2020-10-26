<template>
  <div class="modal confirmation-modal" :class="{ 'is-active': isActive }">
    <div class="modal-background" @click="closeModal()"></div>
    <div class="modal-content">
      <div class="notification">
        <div class="modal-heading">
          <span class="modal-title">Remove {{ item }}</span>
          <i class="material-icons close" @click="closeModal()">
            close
          </i>
        </div>
        <div class="modal-body">
          <template v-if="link">
            <div class="control">
              <p class="has-text-centered is-size-5"
                >Are you sure you want to delete this link?</p
              >
              <input
                type="text"
                class="input"
                v-model="link"
                disabled
                style="cursor: default"
              />
            </div>
          </template>
          <p v-else class="has-text-centered is-size-5"
            >Are you sure you want to delete all build links?</p
          >
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
            Remove {{ item }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    link: {
      type: String,
      required: false,
      default: () => null,
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
      this.$emit('action-confirmed');
      this.closeModal();
    },
  },
  computed: {
    item() {
      return this.link ? 'Link' : 'Links';
    },
  },
};
</script>
