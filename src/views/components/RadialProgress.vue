<template>
    <svg
        class="radial-progress"
        xmlns="http://www.w3.org/2000/svg"
        height="160"
        width="200"
        viewBox="0 0 200 160"
    >
        <path
            stroke="#ccc"
            d="M41 149.5a77 77 0 1 1 117.93 0"
            fill="none"
            :style="{ 'stroke-width': strokeWidth }"
            style="will-change: auto; transition: stroke-dashoffset 850ms ease-in-out;"
        ></path>
        <path
            d="M41 149.5a77 77 0 1 1 117.93 0"
            fill="none"
            stroke-dasharray="350"
            stroke-dashoffset="350"
            :class="meterStyle"
            :style="{ 'stroke-width': strokeWidth }"
            style="will-change: auto; transition: stroke-dashoffset 850ms ease-in-out"
            ref="meter"
        ></path>
        <text
            class="is-size-2 has-text-weight-bol"
            x="102"
            y="110"
            text-anchor="middle"
            fill="#dee5ed"
        >
            {{ percentage }}%
        </text>
    </svg>
</template>

<script>
export default {
    props: {
        strokeWidth: {
            required: true,
        },
        percentage: {
            required: true,
        },
        failing: {
            required: false,
            default: false,
        },
    },
    computed: {
        meterStyle() {
            if (this.failing === true) {
                return 'has-stroke-danger';
            } else if (this.percentage === 100) {
                return 'has-stroke-success';
            }

            return 'has-stroke-info';
        }
    },
    methods: {
        getTotalLength() {
            return this.$refs.meter.getTotalLength();
        },
    },
    mounted() {
        const path = this.$refs.meter;
        const length = this.getTotalLength();
        const strokeLength = length * ((100 - this.percentage) / 100);
        path.getBoundingClientRect(); // trigger layout for animation
        path.style.strokeDashoffset = Math.max(0, strokeLength);
    },
};
</script>
