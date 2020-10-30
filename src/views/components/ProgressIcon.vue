<template>
  <div class="progress-icon">
    <span v-if="progress === 'failing'" class="has-text-danger">
      <i class="fas fa-exclamation"></i>
    </span>
    <span v-else-if="progress === 'in progress'" class="has-text-info">
      <i class="fas fa-spinner"></i>
    </span>
    <span v-else-if="progress === 'active'" class="has-text-info">
      <i class="fas fa-sync"></i>
    </span>
    <span v-else-if="progress === 'validated'">
      <i class="fas fa-check-circle"></i>
    </span>
    <span v-else-if="progress === 'graduated'">
      <i class="fas fa-graduation-cap"></i>
    </span>
    <span v-else>
      <i class="fas fa-ellipsis-h"></i>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    progress: {
      type: String,
      required: true,
    },
  },
};
</script>
