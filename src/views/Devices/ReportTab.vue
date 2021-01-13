<template>
  <div class="report-tab">
    <div class="content has-text-left">
      <pre>{{ latestReport }}</pre>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['activeDeviceDetails']),
    latestReport() {
      return JSON.stringify(
        this.activeDeviceDetails.latest_report || {},
        null,
        '  '
      );
    },
  },
};
</script>
