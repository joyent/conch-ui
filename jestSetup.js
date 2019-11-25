import Vue from 'vue';

Vue.config.devtools = false;
Vue.config.productionTip = false;

// temporary workaround for an issue with v-calendar
window.matchMedia =
    window.matchMedia ||
    function() {
        return {
            matches: false,
            addListener: function() {},
            removeListener: function() {},
        };
    };
