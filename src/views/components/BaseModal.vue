<template>
  <div class="modal base-modal" :class="{ 'is-active': isActive }">
    <div class="modal-background" @click="closeModal()"></div>
    <div class="modal-content">
      <div class="notification is-marginless">
        <button class="delete is-medium" @click="closeModal()"></button>
        <div class="modal-icon has-text-centered">
          <slot name="icon"></slot>
        </div>
        <div class="modal-title has-text-centered">
          <slot name="title"></slot>
        </div>
        <slot name="body"></slot>
      </div>
      <footer>
        <slot name="footer"></slot>
      </footer>
    </div>
  </div>
</template>

<script>
import { EventBus } from '@src/eventBus.js';

export default {
  data() {
    return {
      isActive: false,
    };
  },
  methods: {
    closeModal() {
      this.isActive = false;
      EventBus.$emit('closeModal:baseModal');
    },
  },
  mounted() {
    this.isActive = true;
  },
};
</script>
