<template>
  <div class="page-not-found hero is-fullheight">
    <div class="content-left">
      <h1 class="title">404</h1>
      <h2 class="subtitle is-5">
        The page you're looking for is... missing.
      </h2>
      <hr />
      <p class="is-size-5" style="padding-bottom: 10px;">
        If you think something is broken, please report it.
      </p>
      <p class="is-size-5">
        Otherwise, head back to the Builds page.
      </p>
      <div class="buttons">
        <a
          class="button has-text-danger is-dark is-uppercase has-text-weight-semibold report-problem"
          style="text-decoration: none;"
          href="https://github.com/joyent/conch-ui/issues/new"
          target="_blank"
        >
          Report a Problem
        </a>
        <a
          class="button is-info is-uppercase has-text-weight-semibold recent-build"
          @click="$router.push({ name: 'builds' })"
        >
          Builds Page
          <span class="icon is-small material-icons" style="margin-left: 10px"
            >arrow_forward</span
          >
        </a>
      </div>
    </div>
    <div class="content-right">
      <img src="../../assets/taken.svg" width="550" />
    </div>
  </div>
</template>
