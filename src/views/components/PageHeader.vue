<template>
    <section class="hero is-primary welcome is-small is-bold">
        <div class="hero-body">
            <h1 class="title">{{ title }}</h1>
            <h2 class="subtitle" v-if="subtitle">{{ subtitle }}</h2>
        </div>
    </section>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            required: true,
        },
        subtitle: {
            type: String,
            required: false,
            default: '',
        },
    },
};
</script>
