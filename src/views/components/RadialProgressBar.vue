<template>
    <div
        :id="`progress-bar-${id}`"
        :class="`progress-bar-${id}`"
        :style="{ width: `${width}px`, height: `${height}px` }"
    ></div>
</template>

<script>
import ProgressBar from 'progressbar.js';

export default {
    props: {
        color: {
            type: String,
            required: false,
            default: '#209cee',
        },
        easing: {
            type: String,
            required: false,
            default: 'easeInOut',
        },
        height: {
            type: Number,
            required: false,
            default: 70,
        },
        id: {
            type: String,
            required: true,
        },
        strokeWidth: {
            type: Number,
            required: false,
            default: 6,
        },
        trailColor: {
            type: String,
            required: false,
            default: '#eee'
        },
        trailWidth: {
            type: Number,
            required: false,
            default: 6,
        },
        unit: {
            type: String,
            required: false,
            default: '%',
        },
        value: {
            type: Number,
            required: true,
            default: 0,
        },
        width: {
            type: Number,
            required: false,
            default: 70,
        },
    },
    data() {
        return {
            graph: {},
        };
    },
    computed: {
        graphValue() {
            return this.value / 100;
        },
    },
    mounted() {
        const unit = this.unit;

        this.graph = new ProgressBar.Circle(`#progress-bar-${this.id}`, {
            color: this.color,
            duration: 1200,
            easing: this.easing,
            step: function(state, circle) {
                const value = Math.round(circle.value() * 100);
                if (value === 0) {
                    circle.setText(`0${unit}`);
                } else {
                    circle.setText(`${value}${unit}`);
                }

                circle.text.style.color = '#fff';
            }.bind(this),
            strokeWidth: this.strokeWidth,
            svgStyle: null,
            text: {
                value: this.value,
            },
            trailColor: this.trailColor,
            trailWidth: this.trailWidth,
        });

        this.graph.animate(this.graphValue);
    },
    updated() {
        this.graph.animate(this.graphValue);
    },
    destroyed() {
        this.graph.destroy();
    },
};
</script>
