<template>
  <transition name="fade">
    <div class="remove-item-modal modal" :class="{ 'is-active': isActive }">
      <div class="modal-background" @click="closeModal()"></div>
      <div class="modal-card">
        <header class="modal-card-head" :class="{ 'is-success': isSuccessful }">
          <p class="modal-card-title" v-if="!isSuccessful">
            Confirm Removal
          </p>
          <p class="modal-card-title" v-else>Success!</p>
          <i class="material-icons close" @click="closeModal()">
            close
          </i>
        </header>
        <section class="modal-card-body">
          <div v-if="!isSuccessful">
            <p>
              Are you sure you want to remove
              <span
                class="has-text-white has-text-weight-bold"
                v-if="itemType !== 'device'"
              >
                {{ item.name }}
              </span>
              <span class="has-text-white has-text-weight-bold" v-else>
                {{ item.serial_number }}
              </span>
              ?
            </p>
            <br />
            <div class="buttons-group" v-if="!isSuccessful">
              <a class="button" @click="closeModal()">Cancel</a>
              <a
                class="button is-danger"
                :class="{ 'is-loading': isLoading }"
                @click="removeItem()"
              >
                Confirm
              </a>
            </div>
          </div>
          <div v-else>
            <p>
              <span class="has-text-white has-text-weight-bold">
                {{ item.name }}
              </span>
              has been successfully removed.
            </p>
            <br />
            <a class="button is-success" @click="closeModal()">
              Close
            </a>
          </div>
        </section>
      </div>
    </div>
  </transition>
</template>

<script>
import { EventBus } from '@src/eventBus.js';

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    itemType: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isActive: true,
      isLoading: false,
      isSuccessful: false,
    };
  },
  methods: {
    closeModal() {
      this.isActive = false;
      EventBus.$emit('close-modal:remove-item');
    },
    removeItem() {
      this.isLoading = true;
      EventBus.$emit(`remove-item:${this.itemType}`, this.item);
    },
  },
  created() {
    EventBus.$on('item-removed', () => {
      this.isSuccessful = true;
      this.isLoading = false;
    });
  },
};
</script>
