<template>
    <div class="table-pagination">
        <div class="select-with-label">
            <label class="select-label">Rows</label>
            <div class="select results-per-page">
                <select
                    v-model="resultsPerPage"
                    @change="changeResultsPerPage"
                >
                    <option value="25">25</option>
                    <option v-if="totalResults > 25" value="50">50</option>
                    <option v-if="totalResults > 50" value="75">75</option>
                    <option v-if="totalResults > 75" value="100">100</option>
                    <option v-if="totalResults > 100" value="125">125</option>
                </select>
            </div>
        </div>
        <div class="current-results">
            <p v-if="totalResults === 0">0 results</p>
            <p v-else-if="currentPage === 1 && currentPage === totalPages">
                1 - {{ totalResults }} of {{ totalResults }} results
            </p>
            <p v-else-if="currentPage === 1 && currentPage !== totalPages">
                1 - {{ resultsPerPage }} of {{ totalResults }} results
            </p>
            <p v-else-if="currentPage > 1 && currentResultsStart !== totalResults">
                {{ currentResultsStart }} - {{ currentResultsEnd }} of {{ totalResults }} results
            </p>
            <p v-else>{{ totalResults }} of {{ totalResults }} results</p>
        </div>
        <nav class="pagination">
            <ul class="pagination-list">
                <li v-if="totalPages > 1">
                    <a
                        class="pagination-link prev"
                        :disabled="currentPage === 1"
                        @click="paginate(currentPage - 1)"
                    >
                        <i class="fas fa-arrow-left"></i>
                        <span>Prev</span>
                    </a>
                </li>
                <li v-if="totalPages > 4 && currentPage > 2">
                    <a
                        class="pagination-link page"
                        @click="paginate(1)"
                    >
                        1
                    </a>
                </li>
                <li v-if="totalPages > 4 && currentPage > 2">
                    <span class="pagination-link ellipsis">...</span>
                </li>
                <li>
                    <a
                        class="pagination-link page"
                        :class="{ 'is-current': currentPage === 1 }"
                        v-if="currentPage <= 2"
                        @click="paginate(1)"
                    >
                        1
                    </a>
                    <a
                        class="pagination-link page"
                        v-else-if="currentPage === totalPages"
                        @click="paginate(currentPage - 2)"
                    >
                        {{ currentPage - 2 }}
                    </a>
                    <a
                        class="pagination-link page"
                        @click="paginate(currentPage - 1)"
                        v-else
                    >
                        {{ currentPage - 1}}
                    </a>
                </li>
                <li v-if="totalPages >= 2">
                    <a
                        class="pagination-link page"
                        :class="{ 'is-current': currentPage === 2 }"
                        v-if="currentPage <= 2"
                        @click="paginate(2)"
                    >
                        2
                    </a>
                    <a
                        class="pagination-link page"
                        @click="paginate(currentPage - 1)"
                        v-else-if="currentPage === totalPages"
                    >
                        {{ currentPage - 1}}
                    </a>
                    <a
                        class="pagination-link page"
                        :class="{ 'is-current': currentPage !== 1 && currentPage !== totalPages }"
                        v-else
                    >
                        {{ currentPage }}
                    </a>

                </li>
                <li v-if="totalPages >= 3">
                    <a
                        class="pagination-link page"
                        v-if="currentPage <= 2"
                        @click="paginate(3)"
                    >
                        3
                    </a>
                    <a
                        class="pagination-link page"
                        :class="{ 'is-current': currentPage === totalPages }"
                        v-else-if="currentPage === totalPages"
                    >
                        {{ currentPage }}
                    </a>
                    <a
                        class="pagination-link page"
                        @click="paginate(currentPage + 1)"
                        v-else
                    >
                        {{ currentPage + 1 }}
                    </a>

                </li>
                <li v-if="totalPages > 4 && currentPage < totalPages - 2">
                    <span class="pagination-link ellipsis">...</span>
                </li>
                <li v-if="totalPages > 4 && currentPage < totalPages - 2">
                    <a
                        class="pagination-link"
                        @click="paginate(totalPages)"
                    >
                        <span>{{ totalPages }}</span>
                    </a>
                </li>
                <li v-if="totalPages > 1">
                    <a
                        class="pagination-link next"
                        :disabled="currentPage === totalPages"
                        @click="paginate(currentPage + 1)"
                    >
                        <span>Next</span>
                        <i class="fas fa-arrow-right"></i>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script>
import { EventBus } from '@src/eventBus.js';

export default {
    props: {
        totalResults: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            currentPage: 1,
            resultsPerPage: 25,
        };
    },
    computed: {
        currentResultsEnd() {
            const currentPage = this.currentPage;
            const resultsPerPage = this.resultsPerPage;
            const totalResults = this.totalResults;

            if ((currentPage * resultsPerPage) > totalResults) {
                return totalResults;
            } else {
                return resultsPerPage * currentPage;
            }
        },
        currentResultsStart() {
            if (this.currentPage === 1) {
                return 1;
            } else {
                return (this.resultsPerPage * (this.currentPage - 1)) + 1;
            }
        },
        totalPages() {
            let resultsPerPage = this.resultsPerPage;
            let totalResults = this.totalResults;

            if (totalResults < resultsPerPage) {
                return 1;
            } else {
                let pages = totalResults / resultsPerPage;

                if (pages % 2 !== 0) {
                    pages++;
                }

                return Math.round(pages);
            }
        },
    },
    methods: {
        changeResultsPerPage() {
            EventBus.$emit('changeResultsPerPage', {
                resultsPerPage: this.resultsPerPage,
            });
        },
        paginate(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;

                EventBus.$emit('paginate', {
                    currentPage: this.currentPage,
                    resultsPerPage: this.resultsPerPage,
                });
            }
        },
    },
};
</script>
