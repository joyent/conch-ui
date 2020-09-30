<template>
    <div class="page-not-found hero is-fullheight">
        <div class="content-left">
            <h1 class="title">404</h1>
            <h2 class="subtitle is-5">
                The page you're looking for is... missing.
            </h2>
            <hr />
            <p class="is-size-5">
                Head back to the build you most recently interacted with.
            </p>
            <p class="is-size-5">
                If you think something is broken, please report it.
            </p>
            <div class="buttons">
                <a
                    class="button is-outlined is-info is-uppercase has-text-weight-semibold recent-build"
                    @click="routeToMostRecentBuild()"
                >
                    Most Recent Build
                </a>
                <a
                    class="button is-outlined is-danger is-uppercase has-text-weight-semibold report-problem"
                    href="https://github.com/joyent/conch-ui/issues/new"
                    target="_blank"
                >
                    Report a Problem
                </a>
            </div>
        </div>
        <div class="content-right">
            <img src="../../assets/taken.svg" width="550" />
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        routeToMostRecentBuild() {
            this.$router.push({ name: 'dashboard' });
        },
    },
};
</script>
