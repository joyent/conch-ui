<template>
  <div class="validation-tab">
    <Spinner v-if="isEmpty(deviceValidationState)" />
    <table class="table is-narrow is-marginless is-fullwidth" v-else>
      <thead>
        <tr>
          <th></th>
          <th>Status</th>
          <th>Name</th>
          <th>Description</th>
          <th class="has-text-centered">Version</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(validation, validationIndex) in deviceValidations">
          <tr
            :class="{
              'is-selected': isRowSelected(validationIndex),
            }"
            class="row"
            @click="revealValidationDetails(validationIndex)"
            style="cursor: pointer;"
            :key="validationIndex"
          >
            <td>
              <div class="icon">
                <i
                  class="fas fa-caret-down"
                  v-if="isRowSelected(validationIndex)"
                ></i>
                <i class="fas fa-caret-right" v-else></i>
              </div>
            </td>
            <td>
              <template
                v-for="(result, resultIndex) in resultCount(validation.results)"
              >
                <span
                  class="tag"
                  :class="resultCountStyle(result[0])"
                  :key="resultIndex"
                >
                  {{ result[1] }}
                </span>
              </template>
            </td>
            <td>{{ validation.name }}</td>
            <td>
              <span
                v-if="validation.description"
                v-html="validation.description"
              ></span>
              <span class="has-text-grey" v-else>
                No Description
              </span>
            </td>
            <td class="has-text-centered">
              {{ validation.version }}
            </td>
          </tr>
          <tr
            v-if="isRowSelected(validationIndex)"
            :key="`${validationIndex}a`"
          >
            <td colspan="6">
              <div class="content">
                <table
                  class="table is-narrow is-marginless is-fullwidth"
                  style="background-color: #1a2531"
                >
                  <thead>
                    <tr>
                      <th>Component</th>
                      <th>Category</th>
                      <th>Results</th>
                      <th>Message</th>
                      <th>Hint</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      :class="{
                        'has-background-warning has-text-dark':
                          result.status !== 'pass',
                      }"
                      v-for="(result, index) in validation.results"
                      :key="index"
                    >
                      <td>{{ `${result.component || 'N/A'}` }}</td>
                      <td>{{ `${result.category || 'N/A'}` }}</td>
                      <td>{{ result.status }}</td>
                      <td>{{ result.message }}</td>
                      <td v-if="result.hint">{{ result.hint }}</td>
                      <td v-else>
                        <span class="has-text-grey">No Hint</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
      <tfoot>
        <tr>
          <th></th>
          <th>Status</th>
          <th>Name</th>
          <th>Description</th>
          <th class="has-text-centered">Version</th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import countBy from 'lodash/countBy';
import groupBy from 'lodash/groupBy';
import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';
import Spinner from '@views/components/Spinner.vue';
import { getDeviceValidations } from '@api/devices.js';

export default {
  components: {
    Spinner,
  },
  data() {
    return {
      deviceValidationState: {},
      validationDetailsRows: [],
    };
  },
  methods: {
    async fetchData() {
      let validationsResponse;

      try {
        validationsResponse = await getDeviceValidations(
          this.$route.params.deviceId
        );
        this.deviceValidationState = validationsResponse.data;
      } catch (error) {
        let errorMessage;

        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          errorMessage = `Error: ${error.response.data.error}`;
        } else {
          errorMessage = 'An error occurred';
        }

        this.$toasted.error(errorMessage, {
          action: [
            {
              icon: 'close',
              onClick: (e, toastObject) => {
                toastObject.goAway(0);
              },
            },
          ],
          duration: 6000,
          icon: 'error',
        });
      }
    },
    isEmpty,
    isRowSelected(index) {
      return this.validationDetailsRows.indexOf(index) >= 0;
    },
    revealValidationDetails(index) {
      if (this.validationDetailsRows.indexOf(index) === -1) {
        this.validationDetailsRows.push(index);
      } else {
        this.validationDetailsRows.splice(
          this.validationDetailsRows.indexOf(index),
          1
        );
      }
    },
    resultCount(results) {
      const counts = countBy(results, 'status');
      return Object.entries(counts);
    },
    resultCountStyle(status) {
      if (status === 'fail') {
        return 'is-warning';
      } else if (status === 'error') {
        return 'is-danger';
      }

      return 'is-info';
    },
  },
  computed: {
    deviceValidations() {
      const validations = [];
      const validationStateResultsById = this.validationStateResultsById;

      Object.keys(validationStateResultsById).map(validationId => {
        const results = validationStateResultsById[validationId];
        const { name, description, version } = results[0];

        validations.push({
          results,
          description,
          name,
          version,
        });
      });

      return sortBy(validations, validation => validation.name);
    },
    validationStateResultsById() {
      return groupBy(this.deviceValidationState.results, 'validation_id');
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>
