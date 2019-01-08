<template>
    <svg xmlns="http://www.w3.org/2000/svg" height="160" width="200" viewBox="0 0 200 160">
        <path
            stroke="#ccc"
            d="M41 149.5a77 77 0 1 1 117.93 0"
            fill="none"
            :style="{ 'stroke-width': strokeWidth }"
            style="will-change: auto; transitions: stroke-dashoffset 850ms ease-in-out;"
        ></path>
        <path
            d="M41 149.5a77 77 0 1 1 117.93 0"
            fill="none"
            stroke-dasharray="350"
            stroke-dashoffset="350"
            :class="meterStyle"
            :style="{ strokeWidth }"
            style="will-change: auto; transition: stroke-dashoffset 850ms ease-in-out"
        ></path>
        <text class="is-size-2 has-text-weight-bol" x="102" y="110" text-anchor="middle" fill="#dee5ed">{{ percentage }}%</text>
    </svg>
</template>

<script>
export default {
    props: {
        strokeWidth: {
            required: false,
        },
        percentage: {
            required: false,
        },
        failing: {
            required: false,
            default: false,
        },
    },
    computed: {
        meterStyle() {
            return {
                'has-stroke-danger': this.failing,
                'has-stroke-success': this.percentage === 100,
                'has-stroke-info': this.percentage !== 100
            };
        }
    },
}
</script>
