<template>
  <div class="validation-tab">
    <Spinner v-if="!activeDeviceValidations.length && !validations.length" />
    <table class="table is-narrow is-marginless is-fullwidth" v-else>
      <thead>
        <tr>
          <th></th>
          <th>Status</th>
          <th>Name</th>
          <th>Description</th>
          <th>Version</th>
          <th></th>
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
            <td class="has-text-centered">
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
            <td>
              <span
                class="icon is-medium has-text-success tooltip is-tooltip-left is-tooltip-success"
                v-if="validation.deactivated == null"
                data-tooltip="Active Validation"
              >
                <i class="fas fa-lg fa-check-circle"></i>
              </span>
              <span
                class="icon is-medium has-text-warning tooltip is-tooltip-left is-tooltip-warning"
                v-else
                data-tooltip="Inactive Validation"
              >
                <i class="fas fa-lg fa-exclamation-triangle"></i>
              </span>
            </td>
          </tr>
          <tr
            v-if="isRowSelected(validationIndex)"
            :key="`${validationIndex}a`"
          >
            <td></td>
            <td colspan="3">
              <div class="content">
                <table class="table is-narrow is-marginless is-fullwidth">
                  <thead>
                    <tr>
                      <th>Component / Category</th>
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
                      <td>{{
                        result.component ? result.component : result.category
                      }}</td>
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
          <th>Version</th>
          <th></th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import sortBy from 'lodash/sortBy';
import countBy from 'lodash/countBy';
import groupBy from 'lodash/groupBy';
import Spinner from '@views/components/Spinner.vue';
import { mapState } from 'vuex';

export default {
  components: {
    Spinner,
  },
  data() {
    return {
      validationDetailsRows: [],
    };
  },
  methods: {
    getValidation(validationId) {
      return this.validations.find(validation => {
        return validation.id === validationId;
      });
    },
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
    ...mapState(['activeDeviceValidations', 'validations']),
    deviceValidations() {
      const validations = [];
      const validationStateResultsById = this.validationStateResultsById;

      Object.keys(validationStateResultsById).map(validationId => {
        let {
          created,
          deactivated,
          description,
          id,
          name,
          updated,
          version,
        } = this.getValidation(validationId);

        validations.push({
          results: validationStateResultsById[validationId],
          created,
          deactivated,
          description,
          id,
          name,
          updated,
          version,
        });
      });

      return sortBy(validations, validation => validation.name);
    },
    validationStateResultsById() {
      return groupBy(this.activeDeviceValidations.results, 'validation_id');
    },
  },
};
</script>
