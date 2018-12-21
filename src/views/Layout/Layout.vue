<template>
    <div class="app-layout">
        <Navbar/>
        <div class="section">
            <div class="columns">
                <div class="column is-2">
                    <Sidebar/>
                </div>
                <div class="column is-10">
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Navbar from '../Navbar/Navbar.vue';
import Sidebar from '../Sidebar/Sidebar.vue';

export default {
    components: {
        Navbar,
        Sidebar,
    },
}
</script>
